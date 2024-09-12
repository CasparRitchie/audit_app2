from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import pandas as pd
import os
from werkzeug.utils import secure_filename
import math
import numpy as np

# app = Flask(__name__)
app = Flask(__name__, static_folder="../frontend/build", static_url_path="")
CORS(app, resources={r"/*": {"origins": "*"}})

# Paths to the CSV files
DATA_CSV_PATH = os.path.join(os.path.dirname(__file__), 'questions.csv')
HEADER_CSV_PATH = os.path.join(os.path.dirname(__file__), 'audit_header.csv')  # CSV for audit header
RESPONSES_CSV_PATH = os.path.join(os.path.dirname(__file__), 'responses.csv')
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
RESPONSES_AUDIT_HEADER_CSV_PATH = os.path.join(os.path.dirname(__file__), 'responses_audit_header.csv')


# Ensure the uploads directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def load_header_data():
    df = pd.read_csv(HEADER_CSV_PATH)
    header_data = []
    for _, row in df.iterrows():
        header_data.append({
            "id": row['id'],
            "question": row['question'],
            "type": row['type'],
            "default_value": '' if pd.isna(row.get('default_value')) else str(row.get('default_value', ''))
        })
    return header_data


# Function to load audit detail data
def load_detail_data():
    df = pd.read_csv(DATA_CSV_PATH)
    hierarchical_data = {}
    for _, row in df.iterrows():
        id = row['id']
        chapitre = row['chapitre']
        sous_chapitre = row['sous_chapitre']
        paragraphe = row['paragraphe']
        sous_paragraphe = row['sous_paragraphe']
        question = row['question']
        response_type = row['response_type']
        # Handle NaN by converting it to None
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
            "information": information  # Now 'None' is sent for NaN values
        })

    return hierarchical_data


# @app.route('/')
# def home():
#     return 'Hello, this is your app running!'
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
    data = request.form  # Form data
    files = request.files  # Uploaded files

    new_data = []
    audit_header_responses = []

    # Process audit header responses
    for key, value in data.items():
        if key.startswith("header"):
            q_key = key.split("[")[1][:-1]
            audit_header_responses.append({"question": q_key, "response": value})

    # Process form responses
    for question, response in data.items():
        if question.startswith("responses"):
            q_key = question.split("[")[1][:-1]
            response_value = response
            comment = data.get(f'comments[{q_key}]', '')
            image = files.get(f'images[{q_key}]')

            # Handle image file saving
            image_filename = None
            if image:
                image_filename = secure_filename(image.filename)
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
                image.save(image_path)

            # Append form response data
            new_data.append({
                "question": q_key,
                "response": response_value,
                "comment": comment,
                "image_path": image_filename or ''
            })

    # Convert both audit header and form response data into DataFrames
    df_new = pd.DataFrame(new_data)
    df_audit_header = pd.DataFrame(audit_header_responses)

    # Append form responses to responses.csv
    if not os.path.exists(RESPONSES_CSV_PATH):
        df_new.to_csv(RESPONSES_CSV_PATH, index=False)
    else:
        df_new.to_csv(RESPONSES_CSV_PATH, mode='a', header=False, index=False)

    # Optionally, save audit header data separately or append to the same file
    # (This example assumes you want to append to a separate file, but adjust as needed)
    if audit_header_responses:
        if not os.path.exists(RESPONSES_AUDIT_HEADER_CSV_PATH):
            df_audit_header.to_csv(RESPONSES_AUDIT_HEADER_CSV_PATH, index=False)
        else:
            df_audit_header.to_csv(RESPONSES_AUDIT_HEADER_CSV_PATH, mode='a', header=False, index=False)

    return jsonify({"status": "success", "message": "Responses saved to responses.csv"})


if __name__ == '__main__':
    app.run(debug=True)
