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


# # Function to load a CSV file from Dropbox
# def load_csv_from_dropbox(file_path):
#     dbx = get_dropbox_client()
#     try:
#         _, res = dbx.files_download(file_path)
#         data = io.BytesIO(res.content)
#         df = pd.read_csv(data, sep=';')
#         return df
#     except dropbox.exceptions.ApiError as e:
#         logging.error(f"Dropbox API error: {e}")
#         return pd.DataFrame()  # Return an empty DataFrame if file doesn't exist

def load_csv_from_dropbox(file_path, header_row=0):
    dbx = get_dropbox_client()
    try:
        _, res = dbx.files_download(file_path)
        data = io.BytesIO(res.content)
        # Use the specified header row
        df = pd.read_csv(data, sep=';', header=header_row)
        return df
    except dropbox.exceptions.ApiError as e:
        logging.error(f"Dropbox API error: {e}")
        return pd.DataFrame()  # Return an empty DataFrame if file doesn't exist


# Function to save a DataFrame to a CSV file in Dropbox
def save_csv_to_dropbox(df, file_path):
    dbx = get_dropbox_client()
    csv_data = df.to_csv(index=False)
    try:
        dbx.files_upload(csv_data.encode(), file_path, mode=dropbox.files.WriteMode('overwrite'))
        logging.info(f"Saved CSV to {file_path} on Dropbox")
    except dropbox.exceptions.ApiError as e:
        logging.error(f"Failed to upload CSV to Dropbox: {e}")


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
    df = load_csv_from_dropbox(DATA_CSV_PATH)
    hierarchical_data = {}
    for _, row in df.iterrows():
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

    return hierarchical_data


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


# API route to fetch audit header data
@app.route('/api/audit_header', methods=['GET'])
def get_audit_header():
    header_data = load_header_data()
    return jsonify(header_data)

# API route to fetch audit detail data
@app.route('/api/audit_detail', methods=['GET'])
def get_audit_detail():
    detail_data = load_detail_data()
    return jsonify(detail_data)


# API route to submit form responses and save to responses.csv
@app.route('/api/submit_audit', methods=['POST'])
def submit_responses():
    try:
        data = request.form  # Form data
        files = request.files  # Uploaded files

        audit_id = data.get('auditId')  # Retrieve the audit ID
        new_data = []
        audit_header_responses = []

        # Process form responses
        for question, response in data.items():
            if question.startswith("responses"):
                q_key = question.split("[")[1][:-1]
                response_value = response
                comment = data.get(f'comments[{q_key}]', '')
                image_list = []

                # Handle image file saving to Dropbox
                if f'images[{q_key}][]' in files:
                    images = request.files.getlist(f'images[{q_key}][]')
                    for image in images:
                        image_filename = secure_filename(image.filename)
                        image_path = f"{UPLOAD_FOLDER}/{image_filename}"
                        dbx = get_dropbox_client()
                        dbx.files_upload(image.read(), image_path, mode=dropbox.files.WriteMode('overwrite'))
                        image_list.append(image_path)

                new_data.append({
                    "auditId": audit_id,
                    "question": q_key,
                    "response": response_value,
                    "comment": comment,
                    "image_path": json.dumps(image_list)  # Save the image paths
                })

        # Convert the new_data to a DataFrame and append or update the responses CSV
        df_new = pd.DataFrame(new_data)

        # Load existing responses from Dropbox
        df_existing = load_csv_from_dropbox(RESPONSES_CSV_PATH)

        # If audit ID exists, update; else append the new data
        if not df_existing.empty and audit_id in df_existing.get('auditId', []):
            df_existing.update(df_new)
        else:
            df_existing = pd.concat([df_existing, df_new], ignore_index=True)

        # Save the updated DataFrame back to Dropbox
        save_csv_to_dropbox(df_existing, RESPONSES_CSV_PATH)

        return jsonify({"status": "success", "message": "Responses saved to Dropbox"})

    except Exception as e:
        logging.error(f"Error in submit_responses: {e}")
        return jsonify({"status": "error", "message": "Failed to submit responses"}), 500


# API to get all audits
@app.route('/api/get_audits', methods=['GET'])
def get_audits():
    # Download the CSV from Dropbox
    df = load_csv_from_dropbox(RESPONSES_CSV_PATH)

    # Check if the DataFrame is not empty
    if not df.empty:
        # Handle NaN values in the DataFrame (replace NaN with empty strings)
        df = df.fillna(value='')

        # Extract relevant audit information
        audits = df[['auditId', 'question', 'response', 'comment', 'image_path']].drop_duplicates()

        # Convert the result to a dictionary
        audits = audits.to_dict(orient='records')

        # Return the processed audit data as JSON
        return jsonify(audits)

    else:
        return jsonify([]), 404


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
