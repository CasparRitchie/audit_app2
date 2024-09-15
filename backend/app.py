# # from flask import Flask, jsonify, request, send_from_directory
# # from flask_cors import CORS
# # import pandas as pd
# # import os
# # from werkzeug.utils import secure_filename
# # import logging
# # import json
# # import os
# # DROPBOX_ACCESS_TOKEN = os.getenv('DROPBOX_ACCESS_TOKEN')

# # # Set up logging to print errors to the console
# # logging.basicConfig(level=logging.DEBUG)

# # # app = Flask(__name__)
# # app = Flask(__name__, static_folder="../frontend/build", static_url_path="")
# # CORS(app, resources={r"/*": {"origins": "*"}})

# # # Paths to the CSV files
# # DATA_CSV_PATH = os.path.join(os.path.dirname(__file__), 'questions.csv')
# # HEADER_CSV_PATH = os.path.join(os.path.dirname(__file__), 'audit_header.csv')  # CSV for audit header
# # RESPONSES_CSV_PATH = os.path.join(os.path.dirname(__file__), 'responses.csv')
# # UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
# # RESPONSES_AUDIT_HEADER_CSV_PATH = os.path.join(os.path.dirname(__file__), 'responses_audit_header.csv')


# # # Ensure the uploads directory exists
# # if not os.path.exists(UPLOAD_FOLDER):
# #     os.makedirs(UPLOAD_FOLDER)

# # app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# # def load_header_data():
# #     df = pd.read_csv(HEADER_CSV_PATH)
# #     header_data = []
# #     for _, row in df.iterrows():
# #         header_data.append({
# #             "id": row['id'],
# #             "question": row['question'],
# #             "type": row['type'],
# #             "default_value": '' if pd.isna(row.get('default_value')) else str(row.get('default_value', ''))
# #         })
# #     return header_data


# # # Function to load audit detail data
# # def load_detail_data():
# #     df = pd.read_csv(DATA_CSV_PATH)
# #     hierarchical_data = {}
# #     for _, row in df.iterrows():
# #         id = row['id']
# #         chapitre = row['chapitre']
# #         sous_chapitre = row['sous_chapitre']
# #         paragraphe = row['paragraphe']
# #         sous_paragraphe = row['sous_paragraphe']
# #         question = row['question']
# #         response_type = row['response_type']
# #         # Handle NaN by converting it to None
# #         information = None if pd.isna(row.get('information')) else row.get('information')

# #         if chapitre not in hierarchical_data:
# #             hierarchical_data[chapitre] = {}

# #         if sous_chapitre not in hierarchical_data[chapitre]:
# #             hierarchical_data[chapitre][sous_chapitre] = {}

# #         if paragraphe not in hierarchical_data[chapitre][sous_chapitre]:
# #             hierarchical_data[chapitre][sous_chapitre][paragraphe] = {}

# #         if sous_paragraphe not in hierarchical_data[chapitre][sous_chapitre][paragraphe]:
# #             hierarchical_data[chapitre][sous_chapitre][paragraphe][sous_paragraphe] = []

# #         hierarchical_data[chapitre][sous_chapitre][paragraphe][sous_paragraphe].append({
# #             "id": id,
# #             "question": question,
# #             "response_type": response_type,
# #             "information": information  # Now 'None' is sent for NaN values
# #         })

# #     return hierarchical_data


# # # Serve React App
# # @app.route('/', defaults={'path': ''})
# # @app.route('/<path:path>')
# # def serve_react_app(path):
# #     if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
# #         return send_from_directory(app.static_folder, path)
# #     else:
# #         return send_from_directory(app.static_folder, 'index.html')

# # # API route to fetch audit header data
# # @app.route('/api/audit_header', methods=['GET'])
# # def get_audit_header():
# #     header_data = load_header_data()
# #     return jsonify(header_data)


# # # API route to fetch audit detail data
# # @app.route('/api/audit_detail', methods=['GET'])
# # def get_audit_detail():
# #     detail_data = load_detail_data()
# #     return jsonify(detail_data)


# # # API route to submit form responses and save to responses.csv
# # @app.route('/api/submit', methods=['POST'])
# # def submit_responses():
# #     try:
# #         data = request.form  # Form data
# #         files = request.files  # Uploaded files

# #         audit_id = data.get('auditId')  # Retrieve the audit ID
# #         new_data = []
# #         audit_header_responses = []

# #         # Process audit header responses
# #         for key, value in data.items():
# #             if key.startswith("header"):
# #                 q_key = key.split("[")[1][:-1]
# #                 audit_header_responses.append({
# #                     "auditId": audit_id,
# #                     "question": q_key,
# #                     "response": value
# #                 })

# #         # Process form responses
# #         for question, response in data.items():
# #             if question.startswith("responses"):
# #                 q_key = question.split("[")[1][:-1]
# #                 response_value = response
# #                 comment = data.get(f'comments[{q_key}]', '')
# #                 image = files.get(f'images[{q_key}]')

# #                 # Handle image file saving
# #                 image_filename = None
# #                 if image:
# #                     image_filename = secure_filename(image.filename)
# #                     image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
# #                     image.save(image_path)

# #                 new_data.append({
# #                     "auditId": audit_id,
# #                     "question": q_key,
# #                     "response": response_value,
# #                     "comment": comment,
# #                     "image_path": image_filename or ''
# #                 })

# #         # Convert both audit header and form response data into DataFrames
# #         df_new = pd.DataFrame(new_data)
# #         df_audit_header = pd.DataFrame(audit_header_responses)

# #         # Load existing responses into a DataFrame if the file exists
# #         if os.path.exists(RESPONSES_CSV_PATH):
# #             df_existing = pd.read_csv(RESPONSES_CSV_PATH)
# #         else:
# #             df_existing = pd.DataFrame()

# #         # Check if the audit ID already exists in the CSV file
# #         if not df_existing.empty and audit_id in df_existing.get('auditId', []):
# #             # Update the existing row for this audit
# #             df_existing.update(df_new)
# #         else:
# #             # Append a new row for this audit
# #             df_existing = pd.concat([df_existing, df_new], ignore_index=True)

# #         # Save the updated DataFrame back to the CSV file
# #         df_existing.to_csv(RESPONSES_CSV_PATH, index=False)

# #         # Optionally, save audit header data separately or append to the same file
# #         if audit_header_responses:
# #             if not os.path.exists(RESPONSES_AUDIT_HEADER_CSV_PATH):
# #                 df_audit_header.to_csv(RESPONSES_AUDIT_HEADER_CSV_PATH, index=False)
# #             else:
# #                 df_audit_header.to_csv(RESPONSES_AUDIT_HEADER_CSV_PATH, mode='a', header=False, index=False)

# #         return jsonify({"status": "success", "message": "Responses saved to responses.csv"})

# #     except Exception as e:
# #         logging.error(f"Error in submit_responses: {e}")
# #         return jsonify({"status": "error", "message": "Failed to submit responses"}), 500


# # @app.route('/api/get_audits', methods=['GET'])
# # def get_audits():
# #     if os.path.exists(RESPONSES_CSV_PATH):
# #         df = pd.read_csv(RESPONSES_CSV_PATH)

# #         # Function to safely parse JSON from the response field
# #         def parse_response(row):
# #             try:
# #                 return json.loads(row) if isinstance(row, str) else row
# #             except (ValueError, TypeError):
# #                 return row  # Return the row as-is if it can't be parsed

# #         # Parse the 'response' field
# #         df['response'] = df['response'].apply(parse_response)

# #         # Convert response dictionaries to strings to avoid unhashable type errors
# #         df['response_str'] = df['response'].apply(lambda x: json.dumps(x) if isinstance(x, dict) else str(x))

# #         # Handle NaN values in the DataFrame (replace NaN with None)
# #         df = df.fillna(value='')  # Replace NaN with empty strings, or use None for nulls

# #         # Extract relevant audit information
# #         audits = df[['auditId', 'question', 'response_str', 'comment', 'image_path']].drop_duplicates()

# #         # Convert 'response_str' back to the original 'response' dict (if needed for the API response)
# #         audits['response'] = audits['response_str'].apply(lambda x: json.loads(x) if isinstance(x, str) else x)

# #         # Drop the temporary string column and convert the result to a dictionary
# #         audits = audits.drop(columns=['response_str']).to_dict(orient='records')

# #         return jsonify(audits)
# #     else:
# #         return jsonify([]), 404


# # @app.route('/api/get_audit/<audit_id>', methods=['GET'])
# # def get_audit(audit_id):
# #     if os.path.exists(RESPONSES_CSV_PATH):
# #         df = pd.read_csv(RESPONSES_CSV_PATH)
# #         audit_data = df[df['auditId'] == audit_id].to_dict(orient='records')
# #         return jsonify(audit_data)
# #     else:
# #         return jsonify({"error": "Audit not found"}), 404


# # if __name__ == '__main__':
# #     app.run(debug=True)


# from flask import Flask, jsonify, request, send_from_directory
# from flask_cors import CORS
# import pandas as pd
# import os
# from werkzeug.utils import secure_filename
# import logging
# import json
# import io
# import dropbox  # Dropbox SDK
# from dotenv import load_dotenv
# import requests


# # Load environment variables from .env file if present
# load_dotenv()

# # Get Dropbox Access Token from environment variable
# DROPBOX_ACCESS_TOKEN = os.getenv('DROPBOX_ACCESS_TOKEN')
# DROPBOX_APP_KEY = os.getenv('DROPBOX_APP_KEY')
# DROPBOX_APP_SECRET = os.getenv('DROPBOX_APP_SECRET')

# # Set up logging to print errors to the console
# logging.basicConfig(level=logging.DEBUG)

# # Initialize the Flask app
# app = Flask(__name__, static_folder="../frontend/build", static_url_path="")
# CORS(app, resources={r"/*": {"origins": "*"}})

# # Dropbox paths
# DATA_CSV_PATH = '/questions.csv'
# HEADER_CSV_PATH = '/audit_header.csv'
# RESPONSES_CSV_PATH = '/responses.csv'
# RESPONSES_AUDIT_HEADER_CSV_PATH = '/responses_audit_header.csv'
# UPLOAD_FOLDER = '/uploads'


# # Initialize Dropbox client
# def get_dropbox_client():
#     if DROPBOX_ACCESS_TOKEN is None:
#         raise EnvironmentError("Dropbox access token not found in environment variables.")
#     return dropbox.Dropbox(DROPBOX_ACCESS_TOKEN)



# def refresh_access_token(refresh_token):
#     url = 'https://api.dropboxapi.com/oauth2/token'
#     data = {
#         'grant_type': 'refresh_token',
#         'refresh_token': refresh_token,
#         'client_id': YOUR_CLIENT_ID,
#         'client_secret': YOUR_CLIENT_SECRET
#     }
#     response = requests.post(url, data=data)
#     if response.status_code == 200:
#         token_data = response.json()
#         return token_data['access_token'], token_data['expires_in']
#     else:
#         raise Exception('Failed to refresh access token')

# # Function to load a CSV file from Dropbox
# def load_csv_from_dropbox(file_path):
#     dbx = get_dropbox_client()
#     try:
#         _, res = dbx.files_download(file_path)
#         data = io.BytesIO(res.content)
#         df = pd.read_csv(data)
#         return df
#     except dropbox.exceptions.ApiError as e:
#         logging.error(f"Dropbox API error: {e}")
#         return pd.DataFrame()  # Return an empty DataFrame if file doesn't exist


# # Function to save a DataFrame to a CSV file in Dropbox
# def save_csv_to_dropbox(df, file_path):
#     dbx = get_dropbox_client()
#     csv_data = df.to_csv(index=False)
#     try:
#         dbx.files_upload(csv_data.encode(), file_path, mode=dropbox.files.WriteMode('overwrite'))
#         logging.info(f"Saved CSV to {file_path} on Dropbox")
#     except dropbox.exceptions.ApiError as e:
#         logging.error(f"Failed to upload CSV to Dropbox: {e}")


# def load_header_data():
#     # Download the CSV from Dropbox
#     df = load_csv_from_dropbox(HEADER_CSV_PATH)

#     # Convert NaN to None
#     header_data = []
#     for _, row in df.iterrows():
#         header_data.append({
#             "id": row['id'],
#             "question": row['question'],
#             "type": row['type'],
#             # Replace NaN with None (which translates to null in JSON)
#             "default_value": None if pd.isna(row.get('default_value')) else str(row.get('default_value', ''))
#         })
#     return header_data


# # Load audit detail data (questions.csv)
# def load_detail_data():
#     df = load_csv_from_dropbox(DATA_CSV_PATH)
#     hierarchical_data = {}
#     for _, row in df.iterrows():
#         id = row['id']
#         chapitre = row['chapitre']
#         sous_chapitre = row['sous_chapitre']
#         paragraphe = row['paragraphe']
#         sous_paragraphe = row['sous_paragraphe']
#         question = row['question']
#         response_type = row['response_type']
#         information = None if pd.isna(row.get('information')) else row.get('information')

#         if chapitre not in hierarchical_data:
#             hierarchical_data[chapitre] = {}

#         if sous_chapitre not in hierarchical_data[chapitre]:
#             hierarchical_data[chapitre][sous_chapitre] = {}

#         if paragraphe not in hierarchical_data[chapitre][sous_chapitre]:
#             hierarchical_data[chapitre][sous_chapitre][paragraphe] = {}

#         if sous_paragraphe not in hierarchical_data[chapitre][sous_chapitre][paragraphe]:
#             hierarchical_data[chapitre][sous_chapitre][paragraphe][sous_paragraphe] = []

#         hierarchical_data[chapitre][sous_chapitre][paragraphe][sous_paragraphe].append({
#             "id": id,
#             "question": question,
#             "response_type": response_type,
#             "information": information
#         })

#     return hierarchical_data

# # Serve React App
# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def serve_react_app(path):
#     if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
#         return send_from_directory(app.static_folder, path)
#     else:
#         return send_from_directory(app.static_folder, 'index.html')

# # API route to fetch audit header data
# @app.route('/api/audit_header', methods=['GET'])
# def get_audit_header():
#     header_data = load_header_data()
#     return jsonify(header_data)

# # API route to fetch audit detail data
# @app.route('/api/audit_detail', methods=['GET'])
# def get_audit_detail():
#     detail_data = load_detail_data()
#     return jsonify(detail_data)

# # API route to submit form responses and save to responses.csv
# @app.route('/api/submit', methods=['POST'])
# def submit_responses():
#     try:
#         data = request.form  # Form data
#         files = request.files  # Uploaded files

#         audit_id = data.get('auditId')  # Retrieve the audit ID
#         new_data = []
#         audit_header_responses = []

#         # Process audit header responses
#         for key, value in data.items():
#             if key.startswith("header"):
#                 q_key = key.split("[")[1][:-1]
#                 audit_header_responses.append({
#                     "auditId": audit_id,
#                     "question": q_key,
#                     "response": value
#                 })

#         # Process form responses
#         for question, response in data.items():
#             if question.startswith("responses"):
#                 q_key = question.split("[")[1][:-1]
#                 response_value = response
#                 comment = data.get(f'comments[{q_key}]', '')
#                 image = files.get(f'images[{q_key}]')

#                 # Handle image file saving to Dropbox
#                 image_filename = None
#                 if image:
#                     image_filename = secure_filename(image.filename)
#                     image_path = f"{UPLOAD_FOLDER}/{image_filename}"
#                     dbx = get_dropbox_client()
#                     dbx.files_upload(image.read(), image_path, mode=dropbox.files.WriteMode('overwrite'))

#                 new_data.append({
#                     "auditId": audit_id,
#                     "question": q_key,
#                     "response": response_value,
#                     "comment": comment,
#                     "image_path": image_filename or ''
#                 })

#         # Convert both audit header and form response data into DataFrames
#         df_new = pd.DataFrame(new_data)
#         df_audit_header = pd.DataFrame(audit_header_responses)

#         # Load existing responses from Dropbox
#         df_existing = load_csv_from_dropbox(RESPONSES_CSV_PATH)

#         # Check if the audit ID already exists in the CSV file
#         if not df_existing.empty and audit_id in df_existing.get('auditId', []):
#             # Update the existing row for this audit
#             df_existing.update(df_new)
#         else:
#             # Append a new row for this audit
#             df_existing = pd.concat([df_existing, df_new], ignore_index=True)

#         # Save the updated DataFrame back to Dropbox
#         save_csv_to_dropbox(df_existing, RESPONSES_CSV_PATH)

#         # Optionally, save audit header data separately or append to the same file
#         if audit_header_responses:
#             df_existing_header = load_csv_from_dropbox(RESPONSES_AUDIT_HEADER_CSV_PATH)
#             df_existing_header = pd.concat([df_existing_header, df_audit_header], ignore_index=True)
#             save_csv_to_dropbox(df_existing_header, RESPONSES_AUDIT_HEADER_CSV_PATH)

#         return jsonify({"status": "success", "message": "Responses saved to Dropbox"})

#     except Exception as e:
#         logging.error(f"Error in submit_responses: {e}")
#         return jsonify({"status": "error", "message": "Failed to submit responses"}), 500

# # API to get all audits

# @app.route('/api/get_audits', methods=['GET'])
# def get_audits():
#     # Download the CSV from Dropbox
#     df = load_csv_from_dropbox(RESPONSES_CSV_PATH)

#     # Check if the DataFrame is not empty
#     if not df.empty:
#         # Function to safely parse JSON from the response field
#         def parse_response(row):
#             try:
#                 return json.loads(row) if isinstance(row, str) else row
#             except (ValueError, TypeError):
#                 return row  # Return the row as-is if it can't be parsed

#         # Parse the 'response' field
#         df['response'] = df['response'].apply(parse_response)

#         # Convert response dictionaries to strings to avoid unhashable type errors
#         df['response_str'] = df['response'].apply(lambda x: json.dumps(x) if isinstance(x, dict) else str(x))

#         # Handle NaN values in the DataFrame (replace NaN with empty strings)
#         df = df.fillna(value='')

#         # Extract relevant audit information
#         audits = df[['auditId', 'question', 'response_str', 'comment', 'image_path']].drop_duplicates()

#         # Convert 'response_str' back to the original 'response' dict
#         audits['response'] = audits['response_str'].apply(lambda x: json.loads(x) if isinstance(x, str) else x)

#         # Drop the temporary string column and convert the result to a dictionary
#         audits = audits.drop(columns=['response_str']).to_dict(orient='records')

#         # Return the processed audit data as JSON
#         return jsonify(audits)

#     else:
#         return jsonify([]), 404


# # API to get a specific audit by audit ID
# @app.route('/api/get_audit/<audit_id>', methods=['GET'])
# def get_audit(audit_id):
#     df = load_csv_from_dropbox(RESPONSES_CSV_PATH)
#     if not df.empty:
#         audit_data = df[df['auditId'] == audit_id].to_dict(orient='records')
#         if audit_data:
#             return jsonify(audit_data)
#         else:
#             return jsonify({"error": "Audit not found"}), 404
#     else:
#         return jsonify({"error": "No audits found"}), 404


# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, jsonify, request, send_from_directory
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

# Load environment variables from .env file if present
load_dotenv()

print("Access Token:", os.getenv('DROPBOX_ACCESS_TOKEN'))
print("App Key:", os.getenv('DROPBOX_APP_KEY'))
print("Refresh Token:", os.getenv('DROPBOX_REFRESH_TOKEN'))
print("App Secret:", os.getenv('DROPBOX_APP_SECRET'))

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



# Function to load a CSV file from Dropbox
def load_csv_from_dropbox(file_path):
    dbx = get_dropbox_client()
    try:
        _, res = dbx.files_download(file_path)
        data = io.BytesIO(res.content)
        df = pd.read_csv(data)
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
    # Download the CSV from Dropbox
    df = load_csv_from_dropbox(HEADER_CSV_PATH)

    # Convert NaN to None
    header_data = []
    for _, row in df.iterrows():
        header_data.append({
            "id": row['id'],
            "question": row['question'],
            "type": row['type'],
            # Replace NaN with None (which translates to null in JSON)
            "default_value": None if pd.isna(row.get('default_value')) else str(row.get('default_value', ''))
        })
    return header_data


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
@app.route('/api/submit', methods=['POST'])
def submit_responses():
    try:
        data = request.form  # Form data
        files = request.files  # Uploaded files

        audit_id = data.get('auditId')  # Retrieve the audit ID
        new_data = []
        audit_header_responses = []

        # Process audit header responses
        for key, value in data.items():
            if key.startswith("header"):
                q_key = key.split("[")[1][:-1]
                audit_header_responses.append({
                    "auditId": audit_id,
                    "question": q_key,
                    "response": value
                })

        # Process form responses
        for question, response in data.items():
            if question.startswith("responses"):
                q_key = question.split("[")[1][:-1]
                response_value = response
                comment = data.get(f'comments[{q_key}]', '')
                image = files.get(f'images[{q_key}]')

                # Handle image file saving to Dropbox
                image_filename = None
                if image:
                    image_filename = secure_filename(image.filename)
                    image_path = f"{UPLOAD_FOLDER}/{image_filename}"
                    dbx = get_dropbox_client()
                    dbx.files_upload(image.read(), image_path, mode=dropbox.files.WriteMode('overwrite'))

                new_data.append({
                    "auditId": audit_id,
                    "question": q_key,
                    "response": response_value,
                    "comment": comment,
                    "image_path": image_filename or ''
                })

        # Convert both audit header and form response data into DataFrames
        df_new = pd.DataFrame(new_data)
        df_audit_header = pd.DataFrame(audit_header_responses)

        # Load existing responses from Dropbox
        df_existing = load_csv_from_dropbox(RESPONSES_CSV_PATH)

        # Check if the audit ID already exists in the CSV file
        if not df_existing.empty and audit_id in df_existing.get('auditId', []):
            # Update the existing row for this audit
            df_existing.update(df_new)
        else:
            # Append a new row for this audit
            df_existing = pd.concat([df_existing, df_new], ignore_index=True)

        # Save the updated DataFrame back to Dropbox
        save_csv_to_dropbox(df_existing, RESPONSES_CSV_PATH)

        # Optionally, save audit header data separately or append to the same file
        if audit_header_responses:
            df_existing_header = load_csv_from_dropbox(RESPONSES_AUDIT_HEADER_CSV_PATH)
            df_existing_header = pd.concat([df_existing_header, df_audit_header], ignore_index=True)
            save_csv_to_dropbox(df_existing_header, RESPONSES_AUDIT_HEADER_CSV_PATH)

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
        # Function to safely parse JSON from the response field
        def parse_response(row):
            try:
                return json.loads(row) if isinstance(row, str) else row
            except (ValueError, TypeError):
                return row  # Return the row as-is if it can't be parsed

        # Parse the 'response' field
        df['response'] = df['response'].apply(parse_response)

        # Convert response dictionaries to strings to avoid unhashable type errors
        df['response_str'] = df['response'].apply(lambda x: json.dumps(x) if isinstance(x, dict) else str(x))

        # Handle NaN values in the DataFrame (replace NaN with empty strings)
        df = df.fillna(value='')

        # Extract relevant audit information
        audits = df[['auditId', 'question', 'response_str', 'comment', 'image_path']].drop_duplicates()

        # Convert 'response_str' back to the original 'response' dict
        audits['response'] = audits['response_str'].apply(lambda x: json.loads(x) if isinstance(x, str) else x)

        # Drop the temporary string column and convert the result to a dictionary
        audits = audits.drop(columns=['response_str']).to_dict(orient='records')

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


# @app.route('/oauth/callback', methods=['GET'])
# def oauth_callback():
#     # Get the authorization code sent from Dropbox
#     auth_code = request.args.get('code')

#     if auth_code:
#         # Exchange authorization code for access token
#         token_url = "https://api.dropboxapi.com/oauth2/token"
#         data = {
#             'code': auth_code,
#             'grant_type': 'authorization_code',
#             'client_id': DROPBOX_APP_KEY,
#             'client_secret': DROPBOX_APP_SECRET,
#             # 'redirect_uri': 'https://auditapp2-58260fe0f659.herokuapp.com/oauth/callback'
#             'redirect_uri': 'http://127.0.0.1:5000/oauth/callback',
#             # 'token_access_type': 'offline'
#         }

#         response = requests.post(token_url, data=data)

#         if response.status_code == 200:
#             token_data = response.json()
#             access_token = token_data.get('access_token')
#             refresh_token = token_data.get('refresh_token')

#             # Ensure access token is present
#             if access_token:
#                 os.environ['DROPBOX_ACCESS_TOKEN'] = access_token
#             else:
#                 return "Failed to get access token from Dropbox"

#             # Ensure refresh token is present (sometimes it's not returned, especially if the session doesn't need a refresh token)
#             if refresh_token:
#                 os.environ['DROPBOX_REFRESH_TOKEN'] = refresh_token
#             else:
#                 print("No refresh token returned from Dropbox")

#             return "Tokens obtained successfully! Access Token: {} Refresh Token: {}".format(access_token, refresh_token)
#         else:
#             return "Failed to get token: {}".format(response.text)
#     else:
#         return "No authorization code provided."

# @app.route('/oauth/callback', methods=['GET'])
# def oauth_callback():
#     # Get the authorization code sent from Dropbox
#     auth_code = request.args.get('code')

#     if auth_code:
#         # Exchange authorization code for access token
#         token_url = "https://api.dropboxapi.com/oauth2/token"
#         data = {
#             'code': auth_code,
#             'grant_type': 'authorization_code',
#             'client_id': DROPBOX_APP_KEY,
#             'client_secret': DROPBOX_APP_SECRET,
#             'redirect_uri': 'http://127.0.0.1:5000/oauth/callback'
#         }

#         response = requests.post(token_url, data=data)

#         if response.status_code == 200:
#             token_data = response.json()
#             access_token = token_data.get('access_token')
#             refresh_token = token_data.get('refresh_token')

#             # Update .env with new tokens
#             update_env_file('DROPBOX_ACCESS_TOKEN', access_token)

#             if refresh_token:
#                 update_env_file('DROPBOX_REFRESH_TOKEN', refresh_token)

#             return "Tokens obtained successfully! Access Token: {} Refresh Token: {}".format(access_token, refresh_token)
#         else:
#             return "Failed to get token: {}".format(response.text)
#     else:
#         return "No authorization code provided."

# @app.route('/oauth/callback', methods=['GET'])
# def oauth_callback():
#     # Get the authorization code sent from Dropbox
#     auth_code = request.args.get('code')

#     if auth_code:
#         # Exchange authorization code for access token
#         token_url = "https://api.dropboxapi.com/oauth2/token"
#         data = {
#             'code': auth_code,
#             'grant_type': 'authorization_code',
#             'client_id': DROPBOX_APP_KEY,
#             'client_secret': DROPBOX_APP_SECRET,
#             'redirect_uri': 'http://127.0.0.1:5000/oauth/callback'
#         }

#         response = requests.post(token_url, data=data)

#         if response.status_code == 200:
#             token_data = response.json()
#             access_token = token_data.get('access_token')
#             refresh_token = token_data.get('refresh_token')

#             # Update .env with new tokens
#             update_env_file('DROPBOX_ACCESS_TOKEN', access_token)

#             if refresh_token:
#                 update_env_file('DROPBOX_REFRESH_TOKEN', refresh_token)

#             # Also update the in-memory environment variables
#             os.environ['DROPBOX_ACCESS_TOKEN'] = access_token
#             if refresh_token:
#                 os.environ['DROPBOX_REFRESH_TOKEN'] = refresh_token

#             return "Tokens obtained successfully! Access Token: {} Refresh Token: {}".format(access_token, refresh_token)
#         else:
#             return "Failed to get token: {}".format(response.text)
#     else:
#         return "No authorization code provided."

# Clear environment variables and .env entries
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


# OAuth Callback function to re-add tokens after OAuth
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

            if refresh_token:
                update_env_file('DROPBOX_REFRESH_TOKEN', refresh_token)

            # Reload the updated environment variables
            load_dotenv()

            return "Tokens obtained successfully! Access Token: {} Refresh Token: {}".format(access_token, refresh_token)
        else:
            return "Failed to get token: {}".format(response.text)
    else:
        return "No authorization code provided."


if __name__ == '__main__':
    app.run(debug=True)
