from flask import Flask, jsonify, request, send_from_directory, send_file
from flask_cors import CORS
import pandas as pd
import os
from werkzeug.utils import secure_filename
import logging
import json
import io
import dropbox  # Dropbox SDK
from dotenv import load_dotenv
import requests
import time
from dotenv import set_key
import matplotlib.pyplot as plt
import matplotlib
import uuid

matplotlib.use('Agg')  # Use Agg backend for non-GUI environments


# Load environment variables from .env file if present
load_dotenv()

# print("Access Token:", os.getenv('DROPBOX_ACCESS_TOKEN'))
# print("App Key:", os.getenv('DROPBOX_APP_KEY'))
# print("Refresh Token:", os.getenv('DROPBOX_REFRESH_TOKEN'))
# print("App Secret:", os.getenv('DROPBOX_APP_SECRET'))

# Get Dropbox Access Token from environment variable
DROPBOX_ACCESS_TOKEN = os.getenv('DROPBOX_ACCESS_TOKEN')
DROPBOX_REFRESH_TOKEN = os.getenv('DROPBOX_REFRESH_TOKEN')
DROPBOX_APP_KEY = os.getenv('DROPBOX_APP_KEY')
DROPBOX_APP_SECRET = os.getenv('DROPBOX_APP_SECRET')

# Set up logging to print errors to the console
logging.basicConfig(level=logging.DEBUG)

# Initialize the Flask app
app = Flask(__name__, static_folder="../frontend/build", static_url_path="")
CORS(app, resources={r"/*": {"origins": "*"}})

# Dropbox paths
DATA_CSV_PATH = '/questions.csv'
HEADER_CSV_PATH = '/audit_header.csv'
RESPONSES_CSV_PATH = '/responses.csv'
RESPONSES_AUDIT_HEADER_CSV_PATH = '/responses_audit_header.csv'
UPLOAD_FOLDER = '/uploads'

# Store the token expiration timestamp globally
token_expiration_time = None


def is_token_expired():
    """Check if the token has expired."""
    global token_expiration_time
    if token_expiration_time is None:
        return True  # Token is not set yet

    # Compare current time with the token expiration time
    return time.time() >= token_expiration_time


# Initialize Dropbox client
def get_dropbox_client():
    global DROPBOX_ACCESS_TOKEN
    if DROPBOX_ACCESS_TOKEN is None or is_token_expired():
        # Token is expired or not available, refresh it
        DROPBOX_ACCESS_TOKEN = refresh_access_token()

    return dropbox.Dropbox(DROPBOX_ACCESS_TOKEN)


def refresh_access_token():
    refresh_token = os.getenv('DROPBOX_REFRESH_TOKEN')
    url = 'https://api.dropboxapi.com/oauth2/token'
    data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': DROPBOX_APP_KEY,
        'client_secret': DROPBOX_APP_SECRET
    }

    response = requests.post(url, data=data)

    # Log the status code and response for debugging
    logging.error(f"Token refresh response status: {response.status_code}")
    logging.error(f"Token refresh response text: {response.text}")

    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data['access_token']
        expires_in = token_data['expires_in']

        # Update the global token expiration time
        global token_expiration_time
        token_expiration_time = time.time() + expires_in

        # Store the new access token in the environment
        os.environ['DROPBOX_ACCESS_TOKEN'] = access_token

        return access_token
    else:
        raise Exception('Failed to refresh access token')


def update_env_file(key, value):
    # Path to your .env file
    env_file_path = '.env'

    # Update the .env file with the new token
    set_key(env_file_path, key, value)


def load_csv_from_dropbox(file_path, header_row=0, delimiter=','):
    dbx = get_dropbox_client()
    try:
        _, res = dbx.files_download(file_path)
        data = io.BytesIO(res.content)

        # Load the CSV data using the specified delimiter
        df = pd.read_csv(data, sep=delimiter, header=header_row)
        logging.info(f"DataFrame loaded from Dropbox (path: {file_path}):\nColumns: {df.columns}\nHead:\n{df.head()}")

        return df
    except dropbox.exceptions.ApiError as e:
        logging.error(f"Dropbox API error: {e}")
        return pd.DataFrame()  # Return an empty DataFrame if file doesn't exist
    except pd.errors.ParserError as e:
        logging.error(f"Parser error when reading CSV from Dropbox: {e}")
        return pd.DataFrame()


# Function to save a DataFrame to a CSV file in Dropbox
def save_csv_to_dropbox(df_new, file_path):
    dbx = get_dropbox_client()

    try:
        # Download existing file content
        _, res = dbx.files_download(file_path)
        existing_data = pd.read_csv(io.BytesIO(res.content), sep=',', encoding='utf-8')

        # Confirm existing data structure with logging
        logging.info(f"Existing data loaded from Dropbox:\n{existing_data.head()}")

        # Check if existing_data is empty or malformed
        if existing_data.empty or existing_data.columns[0].startswith("auditId,question"):
            logging.warning("Existing data appears malformed; reloading with corrected columns.")
            existing_data = pd.DataFrame(columns=df_new.columns)  # Use new data's columns if malformed

    except dropbox.exceptions.ApiError:
        # File doesn't exist, create a new DataFrame with same columns
        logging.warning("No existing file found or error loading existing file. Using new data only.")
        existing_data = pd.DataFrame(columns=df_new.columns)

    # Append new data to the existing DataFrame
    combined_data = pd.concat([existing_data, df_new], ignore_index=True)
    logging.info(f"Final data to be saved to Dropbox:\n{combined_data.head()}")

    # Convert to CSV and save
    csv_data = combined_data.to_csv(index=False, sep=',')
    dbx.files_upload(csv_data.encode('utf-8'), file_path, mode=dropbox.files.WriteMode('overwrite'))
    logging.info(f"Saved CSV to {file_path} on Dropbox")


def load_header_data():
    # Download the CSV with the second row as headers for Audit Header
    df = load_csv_from_dropbox(HEADER_CSV_PATH, header_row=0)

    # Log the initial DataFrame to inspect its structure
    logging.info(f"Loaded header data from CSV:\n{df.head()}")

    # Check if 'id', 'question', 'type', and 'default_value' columns exist
    required_columns = {'id', 'question', 'type', 'default_value'}
    if not required_columns.issubset(df.columns):
        logging.error(f"Missing columns in CSV. Expected columns: {required_columns}, but got: {df.columns}")
        return []

    # Process rows, replacing NaN with None, and log each row
    header_data = []
    for _, row in df.iterrows():
        logging.info(f"Processing row: {row.to_dict()}")
        header_data.append({
            "id": row['id'],
            "question": row['question'],
            "type": row['type'],
            # Replace NaN with None (which translates to null in JSON)
            "default_value": None if pd.isna(row.get('default_value')) else str(row.get('default_value', ''))
        })

    return header_data


def load_audit_header_csv(file_path):
    dbx = get_dropbox_client()
    try:
        _, res = dbx.files_download(file_path)
        data = io.BytesIO(res.content)

        # Read the CSV with semicolon delimiter and explicit header
        df = pd.read_csv(data, sep=';', header=None, encoding='utf-8')

        # Drop any extraneous columns
        df = df[['id', 'question', 'type', 'default_value']]

        # Check and log the loaded column names
        logging.info(f"Loaded columns from CSV: {df.columns}")

        # Ensure columns are as expected
        required_columns = {'id', 'question', 'type', 'default_value'}
        if not required_columns.issubset(df.columns):
            logging.error(f"Missing columns in Audit Header CSV. Expected columns: {required_columns}, but got: {df.columns}")
            return pd.DataFrame()

        # Convert NaN to None for JSON compatibility
        df = df.where(pd.notnull(df), None)
        logging.info(f"Loaded header data from CSV:\n{df.head()}")
        return df

    except dropbox.exceptions.ApiError as e:
        logging.error(f"Dropbox API error: {e}")
        return pd.DataFrame()


# Load audit detail data (questions.csv)
def load_detail_data():
    try:
        df = load_csv_from_dropbox(DATA_CSV_PATH)
        logging.info(f"Loaded detail data from Dropbox:\n{df.head()}")

        hierarchical_data = {}

        # Iterate over each row with added error handling
        for index, row in df.iterrows():
            try:
                id = row['id']
                chapitre = row['chapitre']
                sous_chapitre = row['sous_chapitre']
                paragraphe = row['paragraphe']
                sous_paragraphe = row['sous_paragraphe']
                question = row['question']
                response_type = row['response_type']
                information = None if pd.isna(row.get('information')) else row.get('information')

                if chapitre not in hierarchical_data:
                    hierarchical_data[chapitre] = {}

                if sous_chapitre not in hierarchical_data[chapitre]:
                    hierarchical_data[chapitre][sous_chapitre] = {}

                if paragraphe not in hierarchical_data[chapitre][sous_chapitre]:
                    hierarchical_data[chapitre][sous_chapitre][paragraphe] = {}

                if sous_paragraphe not in hierarchical_data[chapitre][sous_chapitre][paragraphe]:
                    hierarchical_data[chapitre][sous_chapitre][paragraphe][sous_paragraphe] = []

                hierarchical_data[chapitre][sous_chapitre][paragraphe][sous_paragraphe].append({
                    "id": id,
                    "question": question,
                    "response_type": response_type,
                    "information": information
                })

            except KeyError as e:
                logging.error(f"KeyError in row {index}: {e}")
            except Exception as e:
                logging.error(f"Unexpected error in row {index}: {e}")

        return hierarchical_data

    except pd.errors.ParserError as e:
        logging.error(f"ParserError in CSV data: {e}")
        return {}


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/audit_header', methods=['GET'])
def get_audit_header():
    summary_only = request.args.get('summary', 'false').lower() == 'true'
    header_data = load_header_data()

    if summary_only:
        # Return only 'id' and 'question' columns for summary
        header_summary = [{"id": item["id"], "question": item["question"]} for item in header_data]
        return jsonify(header_summary)

    return jsonify(header_data)

@app.route('/api/get_audit_headers', methods=['GET'])
def get_audit_headers():
    try:
        # Load the CSV file
        df = load_csv_from_dropbox(RESPONSES_AUDIT_HEADER_CSV_PATH)

        # Check that the necessary columns are present
        required_columns = {'auditId', 'question'}
        if not required_columns.issubset(df.columns):
            logging.error("Missing columns in the audit header CSV.")
            return jsonify({"error": "Missing columns in the audit header data"}), 500

        # Drop duplicates to get unique headers
        unique_headers = df[['auditId', 'question']].drop_duplicates()

        # Convert DataFrame to dictionary format for JSON response
        headers_data = unique_headers.to_dict(orient='records')
        logging.info(f"Audit Headers loaded for dropdown: {headers_data}")

        return jsonify(headers_data)

    except Exception as e:
        logging.error(f"Error loading audit headers: {e}")
        return jsonify({"error": "Failed to load audit headers"}), 500

# API route to fetch audit detail data
@app.route('/api/audit_detail', methods=['GET'])
def get_audit_detail():
    detail_data = load_detail_data()
    return jsonify(detail_data)


# Modify the function handling submission of audit details
@app.route('/api/submit_audit', methods=['POST'])
@app.route('/api/submit_audit', methods=['POST'])
def submit_audit():
    form_data = request.get_json()
    audit_header_id = form_data.get("auditId")
    responses = form_data.get("responses", {})

    if not audit_header_id or not responses:
        logging.error("Missing audit HEADER ID or responses in form data.")
        return jsonify({"error": "Missing audit HEADER ID or responses"}), 400

    # Generate a unique auditDetailId for this set of responses
    audit_detail_id = str(uuid.uuid4())  # e.g., 'a1b2c3d4-e5f6-7890-gh12-ijkl3456mnop'

    # Prepare data to save, treating `details` as the response string
    data_to_save = []
    for question, response_value in responses.items():
        data_to_save.append({
            "auditId": audit_header_id,
            "auditDetailId": audit_detail_id,  # New unique detail ID
            "question": question,
            "response": response_value,  # Treat details as the response string
            "comment": "",  # Set comment as empty if not available
            "image_path": "[]"  # Set image_path as empty if not available
        })

    # Load existing CSV, append the new data, and save to Dropbox
    try:
        existing_data = load_csv_from_dropbox(RESPONSES_CSV_PATH)
        df_new_data = pd.DataFrame(data_to_save)
        df_combined = pd.concat([existing_data, df_new_data], ignore_index=True)
        save_csv_to_dropbox(df_combined, RESPONSES_CSV_PATH)
        logging.info("Audit details saved successfully.")
        return jsonify({"message": "Audit details submitted successfully"}), 200
    except Exception as e:
        logging.error(f"Failed to save audit details: {e}")
        return jsonify({"error": "Failed to save audit details"}), 500


@app.route('/api/submit', methods=['POST'])
def submit_audit_responses():
    try:
        # Retrieve form data and log for debugging
        data = request.form
        files = request.files
        logging.info(f"Form data received: {data}")

        audit_id = data.get('auditId')
        if not audit_id:
            logging.error("Missing auditId in form data.")
            return jsonify({"status": "error", "message": "Audit ID is missing"}), 400

        logging.info(f"Received audit submission with ID: {audit_id}")

        new_data = []

        # Process form responses
        for question, response in data.items():
            if question.startswith("header"):
                q_key = question.split("[")[1][:-1]
                response_value = response
                comment = data.get(f'comments[{q_key}]', '')
                image_list = []

                # Handle image uploads if needed
                if f'images[{q_key}][]' in files:
                    images = request.files.getlist(f'images[{q_key}][]')
                    for image in images:
                        image_filename = secure_filename(image.filename)
                        image_path = f"{UPLOAD_FOLDER}/{image_filename}"
                        dbx = get_dropbox_client()
                        dbx.files_upload(image.read(), image_path, mode=dropbox.files.WriteMode('overwrite'))
                        image_list.append(image_path)
                        logging.info(f"Uploaded image {image_filename} to Dropbox at {image_path}")

                new_data.append({
                    "auditId": audit_id,
                    "question": q_key,
                    "response": response_value,
                    "comment": comment,
                    "image_path": json.dumps(image_list)
                })

        if not new_data:
            logging.error("No valid responses processed; check form field names in frontend.")
            return jsonify({"status": "error", "message": "No responses to save"}), 400

        # Convert new_data to DataFrame and define consistent columns
        df_new = pd.DataFrame(new_data)
        expected_columns = ["auditId", "question", "response", "comment", "image_path"]
        df_new = df_new.reindex(columns=expected_columns)
        logging.info(f"New data to be saved:\n{df_new}")

        # Save the new data to Dropbox, appending to existing data if present
        save_csv_to_dropbox(df_new, RESPONSES_AUDIT_HEADER_CSV_PATH)

        return jsonify({"status": "success", "message": "Audit header saved successfully"})

    except Exception as e:
        logging.error(f"Error in submit_responses: {e}")
        return jsonify({"status": "error", "message": "Failed to submit responses"}), 500


# API to get all audits
# @app.route('/api/get_audits', methods=['GET'])
# def get_audits():
#     # Load the CSV file from Dropbox
#     df = load_csv_from_dropbox(RESPONSES_CSV_PATH)

#     # Log the initial state of the DataFrame
#     logging.info("DataFrame loaded in get_audits:")
#     logging.info(f"Columns: {df.columns}")
#     logging.info(f"Head:\n{df.head()}")

#     # Check if the DataFrame is not empty and contains the required columns
#     required_columns = {'auditId', 'question', 'response', 'comment', 'image_path'}
#     if not required_columns.issubset(df.columns):
#         logging.error(f"DataFrame is missing required columns. Expected: {required_columns}, Found: {df.columns}")
#         return jsonify({"error": "Missing columns in audit data"}), 500

#     # Drop duplicates and log the resulting DataFrame
#     try:
#         audits = df[['auditId', 'question', 'response', 'comment', 'image_path']].drop_duplicates()
#         logging.info("DataFrame after selecting required columns and dropping duplicates:")
#         logging.info(f"Columns: {audits.columns}")
#         logging.info(f"Head:\n{audits.head()}")

#         # Convert the result to a dictionary and return as JSON
#         audits_dict = audits.to_dict(orient='records')
#         return jsonify(audits_dict)

#     except Exception as e:
#         logging.error(f"Error processing DataFrame in get_audits: {e}")
#         return jsonify({"error": "Failed to process audit data"}), 500

import pandas as pd

# @app.route('/api/get_audits', methods=['GET'])
# def get_audits():
#     df = load_csv_from_dropbox(RESPONSES_CSV_PATH)
#     logging.info("DataFrame loaded in get_audits:")
#     logging.info(f"Columns: {df.columns}")
#     logging.info(f"Head:\n{df.head()}")

#     required_columns = {'auditId', 'question', 'response', 'comment', 'image_path'}
#     if not required_columns.issubset(df.columns):
#         logging.error(f"DataFrame is missing required columns. Expected: {required_columns}, Found: {df.columns}")
#         return jsonify({"error": "Missing columns in audit data"}), 500

#     try:
#         # Replace NaN in 'comment' column with None
#         df['comment'] = df['comment'].replace({pd.NA: None})
#         audits = df[['auditId', 'question', 'response', 'comment', 'image_path']].drop_duplicates()
#         audits_dict = audits.to_dict(orient='records')
#         logging.info("Audits data to be returned as JSON:")
#         logging.info(audits_dict)
#         return jsonify(audits_dict)
#     except Exception as e:
#         logging.error(f"Error processing DataFrame in get_audits: {e}")
#         return jsonify({"error": "Failed to process audit data"}), 500


@app.route('/api/get_audits', methods=['GET'])
def get_audits():
    df = load_csv_from_dropbox(RESPONSES_CSV_PATH)
    logging.info("DataFrame loaded in get_audits:")
    logging.info(f"Columns: {df.columns}")
    logging.info(f"Head:\n{df.head()}")

    # Check required columns and add auditHeaderID if missing
    required_columns = {'auditId', 'question', 'response', 'comment', 'image_path'}
    if 'auditHeaderID' not in df.columns:
        logging.warning("'auditHeaderID' column missing, adding it as empty.")
        df['auditHeaderID'] = ''  # Add empty auditHeaderID column if not present

    # Validate other required columns
    if not required_columns.issubset(df.columns):
        logging.error(f"DataFrame is missing required columns. Expected: {required_columns}, Found: {df.columns}")
        return jsonify({"error": "Missing columns in audit data"}), 500

    try:
        # Replace NaN in 'comment' column with None
        df['comment'] = df['comment'].replace({pd.NA: None})

        # No reduction or dropping of duplicates to preserve detail
        audits_dict = df.to_dict(orient='records')

        logging.info("Audits data to be returned as JSON:")
        logging.info(audits_dict)
        return jsonify(audits_dict)
    except Exception as e:
        logging.error(f"Error processing DataFrame in get_audits: {e}")
        return jsonify({"error": "Failed to process audit data"}), 500


# API to get a specific audit by audit ID
@app.route('/api/get_audit/<audit_id>', methods=['GET'])
def get_audit(audit_id):
    df = load_csv_from_dropbox(RESPONSES_CSV_PATH)
    if not df.empty:
        audit_data = df[df['auditId'] == audit_id].to_dict(orient='records')
        if audit_data:
            return jsonify(audit_data)
        else:
            return jsonify({"error": "Audit not found"}), 404
    else:
        return jsonify({"error": "No audits found"}), 404


# Clear environment variables and .env entries
def clear_tokens():
    env_file_path = '.env'

    # Clear the tokens from the environment variables
    if 'DROPBOX_ACCESS_TOKEN' in os.environ:
        del os.environ['DROPBOX_ACCESS_TOKEN']
    if 'DROPBOX_REFRESH_TOKEN' in os.environ:
        del os.environ['DROPBOX_REFRESH_TOKEN']

    # Remove tokens from the .env file
    set_key(env_file_path, 'DROPBOX_ACCESS_TOKEN', '')
    set_key(env_file_path, 'DROPBOX_REFRESH_TOKEN', '')


# Function to update Heroku config vars
def update_heroku_config_vars(key, value):
    heroku_api_key = os.getenv('HEROKU_API_KEY')
    heroku_app_name = os.getenv('HEROKU_APP_NAME')

    url = f"https://api.heroku.com/apps/{heroku_app_name}/config-vars"
    headers = {
        "Authorization": f"Bearer {heroku_api_key}",
        "Accept": "application/vnd.heroku+json; version=3",
        "Content-Type": "application/json"
    }
    data = {
        key: value
    }

    response = requests.patch(url, headers=headers, json=data)

    if response.status_code == 200:
        print(f"Successfully updated {key} in Heroku config vars.")
    else:
        print(f"Failed to update {key} in Heroku config vars. Response: {response.text}")


@app.route('/oauth/callback', methods=['GET'])
def oauth_callback():
    # Clear existing tokens before starting OAuth
    clear_tokens()

    # Get the authorization code sent from Dropbox
    auth_code = request.args.get('code')

    if auth_code:
        # Exchange authorization code for access token
        token_url = "https://api.dropboxapi.com/oauth2/token"
        data = {
            'code': auth_code,
            'grant_type': 'authorization_code',
            'client_id': DROPBOX_APP_KEY,
            'client_secret': DROPBOX_APP_SECRET,
            'redirect_uri': 'http://127.0.0.1:5000/oauth/callback'
        }

        response = requests.post(token_url, data=data)

        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data.get('access_token')
            refresh_token = token_data.get('refresh_token')

            # Re-add tokens to the environment variables and .env file
            update_env_file('DROPBOX_ACCESS_TOKEN', access_token)
            update_heroku_config_vars('DROPBOX_ACCESS_TOKEN', access_token)  # Update Heroku config

            if refresh_token:
                update_env_file('DROPBOX_REFRESH_TOKEN', refresh_token)
                update_heroku_config_vars('DROPBOX_REFRESH_TOKEN', refresh_token)  # Update Heroku config

            # Reload the updated environment variables
            load_dotenv()

            return "Tokens obtained successfully! Access Token: {} Refresh Token: {}".format(access_token, refresh_token)
        else:
            return "Failed to get token: {}".format(response.text)
    else:
        return "No authorization code provided."


@app.route('/api/chart/cpcnc/<int:c_count>/<int:pc_count>/<int:nc_count>', methods=['GET'])
def get_cpcnc_chart(c_count, pc_count, nc_count):
    logging.debug(f"C/PC/NC counts received: C={c_count}, PC={pc_count}, NC={nc_count}")

    # Pie chart, where the slices will be ordered and plotted counter-clockwise:
    labels = 'C', 'PC', 'NC'
    sizes = [c_count, pc_count, nc_count]
    colors = ['#28a745', '#ffc107', '#dc3545']
    explode = (0.1, 0, 0)  # only "explode" the C slice (slightly pull out)

    plt.figure(figsize=(6, 6))
    plt.pie(sizes, explode=explode, labels=labels, colors=colors, autopct='%1.1f%%',
            shadow=True, startangle=140, textprops={'fontsize': 30})
    plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.

    # Save chart to a BytesIO buffer
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png')


@app.route('/api/chart/okko/<int:ok_count>/<int:ko_count>', methods=['GET'])
def get_okko_chart(ok_count, ko_count):
    # Pie chart for OK/KO
    labels = 'OK', 'KO'
    sizes = [ok_count, ko_count]
    colors = ['#28a745', '#dc3545']
    explode = (0.1, 0)  # only "explode" the OK slice (slightly pull out)

    plt.figure(figsize=(6, 6))
    plt.pie(sizes, explode=explode, labels=labels, colors=colors, autopct='%1.1f%%', shadow=True, startangle=90, textprops={'fontsize': 30})
    plt.axis('equal')

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png')


@app.route('/api/chart/temperature/<int:over63>/<int:under63>', methods=['GET'])
def get_temperature_chart(over63, under63):
    sizes = [over63, under63]
    colors = ['#28a745', '#dc3545']
    explode = (0.1, 0)  # only "explode" the OK slice (slightly pull out)

    plt.figure(figsize=(6, 6))
    plt.pie(sizes, explode=explode, colors=colors, autopct='%1.1f%%', shadow=True, startangle=90, textprops={'fontsize': 30})
    plt.axis('equal')

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png')


@app.route('/api/chart/cold_temperature/<int:over10>/<int:under10>', methods=['GET'])
def get_cold_temperature_chart(over10, under10):
    sizes = [over10, under10]
    colors = ['#28a745', '#dc3545']
    explode = (0.1, 0)  # only "explode" the OK slice (slightly pull out)

    plt.figure(figsize=(6, 6))
    plt.pie(sizes, explode=explode, colors=colors, autopct='%1.1f%%', shadow=True, startangle=90, textprops={'fontsize': 30})
    plt.axis('equal')

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png')


if __name__ == '__main__':
    app.run(debug=True)
