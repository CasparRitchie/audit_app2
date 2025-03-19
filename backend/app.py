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
import math
from plotly import graph_objects as go
import numpy as np
from PIL import Image

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


def sanitize_data(data):
    """Cleans the response, handling NaN values and replacing missing images."""
    if isinstance(data, list):
        return [sanitize_data(item) for item in data]
    elif isinstance(data, dict):
        return {key: sanitize_data(value) for key, value in data.items()}
    elif isinstance(data, float) and np.isnan(data):  # Replace NaN
        return ""
    elif isinstance(data, str) and data.strip() == "[]":  # Replace empty image lists
        return "No image"
    return data


def load_csv_from_dropbox(file_path, header_row=0, delimiter=','):
    dbx = get_dropbox_client()
    try:
        _, res = dbx.files_download(file_path)
        data = io.BytesIO(res.content)

        # Load the CSV data
        df = pd.read_csv(data, sep=delimiter, header=header_row)

        # Strip whitespace from headers to ensure consistent key names
        df.columns = df.columns.str.strip()

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
        # Load existing data
        _, res = dbx.files_download(file_path)
        existing_data = pd.read_csv(io.BytesIO(res.content), sep=',', encoding='utf-8')

        # Strip whitespace from column headers to avoid duplication
        existing_data.columns = existing_data.columns.str.strip()

        logging.info(f"📁 Existing data loaded (Shape: {existing_data.shape})")

    except dropbox.exceptions.ApiError:
        logging.warning("No existing file found. Using new data only.")
        existing_data = pd.DataFrame(columns=df_new.columns)

    # Ensure 'auditHeaderID' column exists
    if 'auditHeaderID' not in existing_data.columns:
        existing_data['auditHeaderID'] = None

    # ✅ **Combine and Remove Duplicates**
    combined_data = pd.concat([existing_data, df_new], ignore_index=True)

    # Log before deduplication
    logging.info(f"📊 Combined data (Shape: {combined_data.shape})")

    # ✅ **Drop ALL duplicates based on (auditId, question, auditDetailId)**
    combined_data.drop_duplicates(subset=['auditId', 'question', 'auditDetailId'], keep='last', inplace=True)

    # Log after deduplication
    logging.info(f"✅ FINAL: Data after removing duplicates (Shape: {combined_data.shape})")

    # Convert to CSV and save
    csv_data = combined_data.to_csv(index=False, sep=',')
    dbx.files_upload(csv_data.encode('utf-8'), file_path, mode=dropbox.files.WriteMode('overwrite'))

    logging.info(f"✅ Cleaned CSV saved to {file_path}")


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

        # Log the columns to ensure we're working with the correct data
        logging.info(f"Audit Headers CSV Columns: {df.columns}")

        # Check that at least 'auditId' is present
        required_columns = {'auditId'}
        if not required_columns.issubset(df.columns):
            logging.error("Missing 'auditId' column in the audit header CSV.")
            return jsonify({"error": "Missing required columns in the audit header data"}), 500

        # Replace NaN values with None for JSON compatibility
        df = df.where(pd.notnull(df), None)

        # Convert the DataFrame to a dictionary format for JSON response
        headers_data = df.to_dict(orient='records')
        logging.info(f"Audit Headers loaded: {headers_data}")

        return jsonify(headers_data)

    except Exception as e:
        logging.error(f"Error loading audit headers: {e}")
        return jsonify({"error": "Failed to load audit headers"}), 500


@app.route('/api/get_audit_headers_grouped', methods=['GET'])
def get_audit_headers_grouped():
    try:
        # Load the CSV file
        df = load_csv_from_dropbox(RESPONSES_AUDIT_HEADER_CSV_PATH)

        # Replace NaN values with None for JSON compatibility
        df = df.where(pd.notnull(df), None)

        # Group data by 'auditId'
        grouped_data = df.groupby('auditId').apply(
            lambda group: {
                "auditId": group.name,
                "questions": group[['question', 'response', 'comment', 'image_path']].to_dict(orient='records')
            }
        ).tolist()

        logging.info(f"Grouped Audit Headers: {grouped_data}")

        return jsonify(grouped_data)

    except Exception as e:
        logging.error(f"Error loading grouped audit headers: {e}")
        return jsonify({"error": "Failed to load grouped audit headers"}), 500


@app.route('/api/get_audit_header_grouped/<audit_id>', methods=['GET'])
def get_audit_header_grouped(audit_id):
    try:
        # Load the CSV file containing audit header responses
        df = load_csv_from_dropbox(RESPONSES_AUDIT_HEADER_CSV_PATH)

        # Filter for the specific audit header ID
        filtered_df = df[df['auditId'] == audit_id]

        # Group by auditId and organize questions and responses
        grouped_data = {
            "auditId": audit_id,
            "questions": filtered_df[['question', 'response', 'comment', 'image_path']].to_dict(orient='records')
        }

        return jsonify(grouped_data)

    except Exception as e:
        logging.error(f"Error fetching grouped audit header for ID {audit_id}: {e}")
        return jsonify({"error": "Failed to fetch audit header"}), 500


@app.route('/api/get_audit_header_detail/<auditId>', methods=['GET'])
def get_audit_header_detail(auditId):
    try:
        # Load the CSV file
        df = load_csv_from_dropbox(RESPONSES_AUDIT_HEADER_CSV_PATH)

        # Check if required columns are present
        required_columns = {'auditId', 'question'}
        if not required_columns.issubset(df.columns):
            logging.error("Missing columns in the audit header CSV.")
            return jsonify({"error": "Missing columns in the audit header data"}), 500

        # Filter the DataFrame to find the row(s) with the specified auditId
        filtered_data = df[df['auditId'] == auditId]

        # If no matching data is found, return an error
        if filtered_data.empty:
            return jsonify({"error": "No data found for the specified audit ID"}), 404

        # Convert the filtered DataFrame to a dictionary for JSON response
        header_data = filtered_data.to_dict(orient='records')
        logging.info(f"Audit Header details loaded for ID {auditId}: {header_data}")

        return jsonify(header_data)

    except Exception as e:
        logging.error(f"Error loading audit header for ID {auditId}: {e}")
        return jsonify({"error": "Failed to load audit header details"}), 500


# API route to fetch audit detail data
@app.route('/api/audit_detail', methods=['GET'])
def get_audit_detail():
    detail_data = load_detail_data()
    return jsonify(detail_data)


@app.route('/api/submit_audit', methods=['POST'])
def submit_audit():
    logging.info("Starting audit submission process.")

    # Extract audit ID
    audit_header_id = request.form.get("auditId")
    if not audit_header_id:
        logging.error("Audit ID is missing in the form data.")
        return jsonify({"error": "Audit ID is missing"}), 400
    logging.info(f"Audit ID received: {audit_header_id}")

    # Extract responses and comments
    responses = json.loads(request.form.get("responses", "{}"))
    comments = json.loads(request.form.get("comments", "{}"))
    logging.info(f"Responses received: {responses}")
    logging.info(f"Comments received: {comments}")

    # Generate a unique auditDetailID for this submission
    audit_detail_id = str(uuid.uuid4())
    logging.info(f"Generated auditDetailID: {audit_detail_id}")

    # Initialize data structure for CSV
    data_to_save = []

    # Process each question response
    for question_id, response_value in responses.items():
        comment_value = comments.get(question_id, "")

        image_paths = []  # Store paths of uploaded images
        images = request.files.getlist(f"images[{question_id}][]")

        for image in images:
            if image.filename:
                filename = secure_filename(image.filename)
                dropbox_path = f"/uploads/{filename}"
                try:
                    dbx = get_dropbox_client()
                    dbx.files_upload(image.read(), dropbox_path, mode=dropbox.files.WriteMode('overwrite'))
                    image_paths.append(dropbox_path)
                except Exception as e:
                    logging.error(f"Failed to upload image {filename}: {e}")

        # Append data for this question
        data_entry = {
            "auditId": audit_header_id,
            "question": question_id,
            "response": response_value,
            "comment": comment_value,
            "image_path": json.dumps(image_paths),
            "auditDetailId": audit_detail_id,
            "auditHeaderID": audit_header_id
        }
        data_to_save.append(data_entry)

    df_new_data = pd.DataFrame(data_to_save)
    df_new_data.columns = df_new_data.columns.str.strip()  # Ensure clean headers
    logging.info(f"New data to append:\n{df_new_data}")

    # Load existing data
    existing_data = load_csv_from_dropbox(RESPONSES_CSV_PATH)

    # Ensure 'auditHeaderID' column exists
    if 'auditHeaderID' not in existing_data.columns:
        existing_data['auditHeaderID'] = audit_header_id

    # Combine new and existing data
    combined_data = pd.concat([existing_data, df_new_data], ignore_index=True)

    # Log before deduplication
    logging.info(f"📊 Combined data (Shape: {combined_data.shape})")

    # ✅ **Remove ALL duplicates based on (auditId, question, auditDetailId)**
    combined_data.drop_duplicates(subset=['auditId', 'question', 'auditDetailId'], keep='last', inplace=True)

    # Log after deduplication
    logging.info(f"✅ FINAL: Data after removing duplicates (Shape: {combined_data.shape})")

    # Save back to Dropbox
    save_csv_to_dropbox(combined_data, RESPONSES_CSV_PATH)
    logging.info("✅ Audit details submitted and saved successfully.")
    return jsonify({"message": "Audit details submitted successfully"}), 200


### ✅ **Function to Remove ALL Duplicates Based on ('auditId', 'question', 'auditDetailId')**
def remove_all_duplicates(df):
    """
    Removes duplicates from responses.csv based on ('auditId', 'question', 'auditDetailId').
    Ensures the latest response is kept and data formatting is consistent.
    """
    logging.info("🚀 Starting duplicate removal process for responses.csv...")

    if df.empty:
        logging.warning("⚠️ responses.csv is empty, skipping duplicate removal.")
        return df

    # ✅ Ensure correct column order & remove unexpected columns
    expected_columns = ['auditId', 'question', 'response', 'comment', 'image_path', 'auditDetailId', 'auditHeaderID']
    df = df[[col for col in expected_columns if col in df.columns]]

    # ✅ Strip whitespace from columns
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    # ✅ Convert columns to string to ensure consistent comparison
    df['auditId'] = df['auditId'].astype(str)
    df['question'] = df['question'].astype(str)
    df['auditDetailId'] = df['auditDetailId'].astype(str)

    # ✅ Sort by 'auditDetailId' to keep only the latest version of each entry
    df.sort_values(by=['auditId', 'question', 'auditDetailId'], ascending=True, inplace=True)

    # ✅ Drop exact duplicates based on 'auditId', 'question', and 'auditDetailId', keeping the last one
    df_cleaned = df.drop_duplicates(subset=['auditId', 'question', 'auditDetailId'], keep='last')

    logging.info(f"✅ Duplicate removal complete. {len(df) - len(df_cleaned)} duplicates removed.")
    return df_cleaned




@app.route('/api/submit', methods=['POST'])
def submit_audit_responses():
    try:
        # Retrieve form data and log for debugging
        data = request.form
        logging.info(f"Form data received: {data}")

        audit_id = data.get('auditId')
        if not audit_id:
            logging.error("Missing auditId in form data.")
            return jsonify({"status": "error", "message": "Audit ID is missing"}), 400

        logging.info(f"Received audit submission with ID: {audit_id}")

        new_data = []

        # Process form responses
        for question, response in data.items():
            if question.startswith("header"):  # Only process "header" fields
                q_key = question.split("[")[1][:-1]  # Extract questionId from "header[questionId]"
                response_value = response

                new_data.append({
                    "auditId": audit_id,
                    "questionId": q_key,
                    "response": response_value
                })

        if not new_data:
            logging.error("No valid responses processed; check form field names in frontend.")
            return jsonify({"status": "error", "message": "No responses to save"}), 400

        # Convert new_data to DataFrame and define consistent columns
        df_new = pd.DataFrame(new_data)
        expected_columns = ["auditId", "questionId", "response"]
        df_new = df_new.reindex(columns=expected_columns)
        logging.info(f"New data to be saved:\n{df_new}")

        # Save the new data to Dropbox, appending to existing data if present
        save_csv_to_dropbox(df_new, RESPONSES_AUDIT_HEADER_CSV_PATH)

        return jsonify({"status": "success", "message": "Audit header saved successfully"})

    except Exception as e:
        logging.error(f"Error in submit_responses: {e}")
        return jsonify({"status": "error", "message": "Failed to submit responses"}), 500


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
        audit_data = df[df['auditId'] == audit_id]

        # ✅ Remove duplicates based on 'question'
        audit_data = audit_data.drop_duplicates(subset=['question'])

        # Convert to dictionary format
        audit_data = audit_data.to_dict(orient='records')

        if audit_data:
            clean_response = sanitize_data(audit_data)  # ✅ Sanitize the data
            return jsonify(clean_response)
        else:
            return jsonify({"error": "Audit not found"}), 404
    else:
        return jsonify({"error": "No audits found"}), 404


@app.route('/api/upload_image', methods=['POST'])
def upload_image():
    """Upload a single image to the Dropbox uploads folder."""
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "No image selected"}), 400

    filename = secure_filename(image.filename)
    dropbox_path = f"/uploads/{filename}"

    try:
        # Upload the image to Dropbox
        dbx = get_dropbox_client()
        dbx.files_upload(image.read(), dropbox_path, mode=dropbox.files.WriteMode('overwrite'))
        logging.info(f"Image {filename} uploaded successfully to {dropbox_path}")
        return jsonify({"message": "Image uploaded successfully", "path": dropbox_path}), 200
    except Exception as e:
        logging.error(f"Failed to upload image {filename}: {e}")
        return jsonify({"error": "Failed to upload image"}), 500


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


figure_size = (2, 2)


@app.route('/api/chart/cpcnc/<int:c_count>/<int:pc_count>/<int:nc_count>', methods=['GET'])
def get_cpcnc_chart(c_count, pc_count, nc_count):
    logging.debug(f"C/PC/NC counts received: C={c_count}, PC={pc_count}, NC={nc_count}")

    # Original data
    labels = ['C', 'PC', 'NC']
    sizes = [c_count, pc_count, nc_count]
    colors = ['#28a745', '#ffc107', '#dc3545']
    explode = (0.1, 0, 0)  # Only "explode" the C slice (slightly pull out)

    # Filter out slices with a size of 0
    filtered_labels = [label for label, size in zip(labels, sizes) if size > 0]
    filtered_sizes = [size for size in sizes if size > 0]
    filtered_colors = [color for size, color in zip(sizes, colors) if size > 0]
    filtered_explode = [e for size, e in zip(sizes, explode) if size > 0]

    # Custom autopct function to hide labels for zero values
    def custom_autopct(pct, all_vals):
        total = sum(all_vals)
        absolute = int(round(pct * total / 100.0))
        return f'{pct:.1f}%' if absolute > 0 else ''

    # Generate the pie chart
    plt.figure(figsize=(figure_size))
    plt.pie(
        filtered_sizes,
        explode=filtered_explode,
        labels=filtered_labels,
        colors=filtered_colors,
        autopct=lambda pct: custom_autopct(pct, filtered_sizes),  # Apply custom autopct
        shadow=True,
        startangle=140,
        textprops={'fontsize': 10}  # Adjust text size for better readability
    )
    plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.

    # Save chart to a BytesIO buffer
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png')


def generate_pie_chart(sizes, labels=None, colors=None, explode=None, startangle=90, textprops=None):
    # Filter out slices with zero values
    filtered_sizes = [size for size in sizes if size > 0]
    if labels:
        filtered_labels = [label for label, size in zip(labels, sizes) if size > 0]
    else:
        filtered_labels = None
    if colors:
        filtered_colors = [color for size, color in zip(sizes, colors) if size > 0]
    else:
        filtered_colors = None
    if explode:
        filtered_explode = [e for size, e in zip(sizes, explode) if size > 0]
    else:
        filtered_explode = None

    # Custom autopct function to hide labels for zero values
    def custom_autopct(pct, all_vals):
        total = sum(all_vals)
        absolute = int(round(pct * total / 100.0))
        return f'{pct:.1f}%' if absolute > 0 else ''

    # Create the pie chart
    plt.figure(figsize=(figure_size))  # Adjust size as needed
    plt.pie(
        filtered_sizes,
        labels=filtered_labels,
        colors=filtered_colors,
        explode=filtered_explode,
        autopct=lambda pct: custom_autopct(pct, filtered_sizes),
        shadow=True,
        startangle=startangle,
        textprops=textprops or {'fontsize': 10},  # Default text properties
    )
    plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.

    # Save chart to a BytesIO buffer
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return img



@app.route('/api/chart/okko/<int:ok_count>/<int:ko_count>', methods=['GET'])
def get_okko_chart(ok_count, ko_count):
    sizes = [ok_count, ko_count]
    labels = ['OK', 'KO']
    colors = ['#28a745', '#dc3545']
    explode = (0.1, 0)  # Only "explode" the OK slice (slightly pull out)

    img = generate_pie_chart(
        sizes=sizes,
        labels=labels,
        colors=colors,
        explode=explode,
        startangle=90,
        textprops={'fontsize': 10},
    )
    return send_file(img, mimetype='image/png')


@app.route('/api/chart/temperature/<int:over63>/<int:under63>', methods=['GET'])
def get_temperature_chart(over63, under63):
    sizes = [over63, under63]
    labels = ['Over 63°C', 'Under 63°C']
    colors = ['#28a745', '#dc3545']
    explode = (0.1, 0)  # Only "explode" the Over slice (slightly pull out)

    img = generate_pie_chart(
        sizes=sizes,
        labels=labels,
        colors=colors,
        explode=explode,
        startangle=90,
        textprops={'fontsize': 10},
    )
    return send_file(img, mimetype='image/png')


@app.route('/api/chart/cold_temperature/<int:over10>/<int:under10>', methods=['GET'])
def get_cold_temperature_chart(over10, under10):
    sizes = [over10, under10]
    labels = ['Under 10°C', 'Over 10°C']
    colors = ['#28a745', '#dc3545']
    explode = (0.1, 0)  # Only "explode" the Over slice (slightly pull out)

    img = generate_pie_chart(
        sizes=sizes,
        labels=labels,
        colors=colors,
        explode=explode,
        startangle=90,
        textprops={'fontsize': 10},
    )
    return send_file(img, mimetype='image/png')


@app.route('/api/chart/gauge/overall/<int:green_count>/<int:amber_count>/<int:red_count>', methods=['GET'])
def generate_overall_gauge(green_count, amber_count, red_count):
    # Calculate percentages for Red, Amber, Green
    total_responses = green_count + amber_count + red_count
    green_percentage = (green_count / total_responses) * 100 if total_responses else 0
    amber_percentage = (amber_count / total_responses) * 100 if total_responses else 0
    red_percentage = (red_count / total_responses) * 100 if total_responses else 0

    # Fix percentages to sum to 50% for visible part of semicircle
    visible_total = red_percentage + amber_percentage + green_percentage
    invisible_padding = 50  # Fill the other half of the semicircle
    scale_factor = 50 / visible_total  # Scale visible percentages to sum to 50%

    red_scaled = red_percentage * scale_factor
    amber_scaled = amber_percentage * scale_factor
    green_scaled = green_percentage * scale_factor

    # Define the values in the fixed Red → Amber → Green order
    values = [red_scaled, amber_scaled, green_scaled, invisible_padding]
    labels = [
        f"NC ({red_percentage:.1f}%)",
        f"PC ({amber_percentage:.1f}%)",
        f"C ({green_percentage:.1f}%)",
        "",  # Invisible padding
    ]
    colors = ["#dc3545", "#ffc107", "#28a745", "rgba(0,0,0,0)"]  # Red, Amber, Green, Transparent

    # Create the pie chart
    fig = go.Figure(go.Pie(
        values=values,
        labels=labels,
        marker=dict(colors=colors),
        textinfo="label",  # Show labels with percentages
        hole=0.5,                  # Donut chart
        direction="clockwise",     # Direction of the chart
        rotation=270,              # Start Red at the bottom
        sort=False                 # Do not auto-sort the order
    ))

    # Calculate pointer angle (ensure high = right, low = left)
    pointer_value = red_percentage + (amber_percentage / 2)  # Midpoint between Red and Amber
    pointer_angle = (pointer_value / 100) * 180  # Flip so higher values point right

    # Add the needle/pointer
    fig.add_shape(
        type="line",
        x0=0.5,
        y0=0.5,
        x1=0.5 + 0.4 * math.cos(math.radians(pointer_angle)),
        y1=0.5 + 0.4 * math.sin(math.radians(pointer_angle)),
        line=dict(color="black", width=4)
    )

    # Update layout for the semicircle
    fig.update_layout(
        showlegend=False,          # Hide legend
        margin=dict(l=0, r=0, t=0, b=0),  # Remove margins
        paper_bgcolor="#f9f9f9",   # Background color
    )

    # Save the chart as PNG
    img = io.BytesIO()
    fig.write_image(img, format="png")
    img.seek(0)

    # Crop the image to remove the blank bottom half
    img = Image.open(img)  # Open the generated image
    width, height = img.size  # Get original dimensions
    cropped_img = img.crop((0, 0, width, height // 2))  # Crop the bottom half
    cropped_img_io = io.BytesIO()
    cropped_img.save(cropped_img_io, format="PNG")
    cropped_img_io.seek(0)

    return send_file(cropped_img_io, mimetype="image/png")




@app.route('/api/chart/gauge/cpcnc/<int:c_count>/<int:pc_count>/<int:nc_count>', methods=['GET'])
def generate_cpcnc_gauge(c_count, pc_count, nc_count):
    total = c_count + pc_count + nc_count
    green_percentage = (c_count / total) * 100 if total else 0
    amber_percentage = (pc_count / total) * 100 if total else 0
    red_percentage = (nc_count / total) * 100 if total else 0

    # Correct pointer calculation
    pointer_value = (green_percentage + amber_percentage) / 2

    # Define gauge zones and the pointer
    colors = ["#28a745", "#ffc107", "#dc3545"]
    labels = ["Green (C)", "Amber (PC)", "Red (NC)"]
    values = [green_percentage, amber_percentage, red_percentage]

    fig = go.Figure(go.Pie(
        values=values,
        labels=labels,
        marker=dict(colors=colors),
        textinfo="label+percent",
        hole=0.5,
    ))

    # Add the gauge pointer
    angle = (1 - (pointer_value / 100)) * 180  # Scale to 180 degrees
    fig.add_shape(
        type="line",
        x0=0.5,
        x1=0.5 + 0.4 * math.cos(math.radians(angle)),
        y0=0.5,
        y1=0.5 + 0.4 * math.sin(math.radians(angle)),
        line=dict(color="black", width=4)
    )

    fig.update_layout(
        showlegend=False,
        margin=dict(l=0, r=0, t=0, b=0),
        paper_bgcolor="#f9f9f9",
    )

    # Save chart as PNG
    img = io.BytesIO()
    fig.write_image(img, format="png")
    img.seek(0)

    return send_file(img, mimetype="image/png")


@app.route('/api/debug_csv/responses', methods=['GET'])
def debug_csv_responses():
    df = load_csv_from_dropbox(RESPONSES_CSV_PATH)

    # Identify duplicates based on 'auditId' and 'question'
    duplicate_rows = df[df.duplicated(subset=['auditId', 'question'], keep=False)]

    logging.info(f"Duplicate rows found:\n{duplicate_rows}")

    return jsonify(duplicate_rows.to_dict(orient='records'))


# @app.route('/api/fix_duplicates/responses', methods=['GET','POST'])
# def fix_csv_duplicates():
#     df = load_csv_from_dropbox(RESPONSES_CSV_PATH)

#     if df.empty:
#         return jsonify({"error": "CSV is empty or missing"}), 500

#     # ✅ Drop duplicates, keeping only the last recorded entry for each auditId + question
#     df_cleaned = df.drop_duplicates(subset=['auditId', 'question'], keep='last')

#     logging.info(f"Cleaned data after removing duplicates:\n{df_cleaned}")

#     # ✅ Save back to Dropbox
#     save_csv_to_dropbox(df_cleaned, RESPONSES_CSV_PATH)

#     return jsonify({"message": "Duplicates removed successfully"}), 200


@app.route('/api/fix_all_duplicates/responses', methods=['POST', 'GET'])
def fix_all_duplicates_responses():
    logging.info("🧹 Running full duplicate cleanup on responses.csv...")

    # Load CSV
    df = load_csv_from_dropbox(RESPONSES_CSV_PATH)

    if df.empty:
        logging.warning("⚠ No data found in responses.csv.")
        return jsonify({"error": "No data found"}), 400

    # ✅ Remove any whitespace in column names
    df.columns = df.columns.str.strip()

    # ✅ Drop **all** duplicated rows
    df = df.drop_duplicates(keep="first")

    # ✅ Ensure no duplicate auditId/question pairs (we keep the last valid entry)
    df = df.drop_duplicates(subset=['auditId', 'question'], keep='last')

    # ✅ Save cleaned file back
    save_csv_to_dropbox(df, RESPONSES_CSV_PATH)
    logging.info("✅ All duplicates removed successfully!")

    return jsonify({"message": "All duplicates removed from responses.csv"}), 200



if __name__ == '__main__':
    app.run(debug=True)
