# # from flask import Flask, jsonify, request
# # from flask_cors import CORS
# # import pandas as pd
# # import os
# # from werkzeug.utils import secure_filename

# # app = Flask(__name__)
# # CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# # # Paths to the CSV files
# # DATA_CSV_PATH = os.path.join(os.path.dirname(__file__), 'questions.csv')
# # RESPONSES_CSV_PATH = os.path.join(os.path.dirname(__file__), 'responses.csv')
# # UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')  # Directory to save images

# # # Ensure the uploads directory exists
# # if not os.path.exists(UPLOAD_FOLDER):
# #     os.makedirs(UPLOAD_FOLDER)

# # app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# # # Function to load data from the CSV file and build the hierarchical structure

# # # Function to load data from the CSV file and build the hierarchical structure
# # def load_data():
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

# #         # Ensure the information field is either a valid string or an empty string
# #         information = row['information'] if pd.notna(row['information']) else ''

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
# #             "information": information  # Ensure proper handling of information
# #         })

# #     return hierarchical_data

# # # API route to fetch hierarchical data
# # @app.route('/api/data', methods=['GET'])
# # def get_data():
# #     hierarchical_data = load_data()
# #     return jsonify(hierarchical_data)

# # # API route to submit form responses and save to responses.csv
# # @app.route('/api/submit', methods=['POST'])
# # def submit_responses():
# #     data = request.form  # Form data
# #     files = request.files  # Uploaded files

# #     # Prepare the data for the responses.csv
# #     new_data = []

# #     for question, response in data.items():
# #         # Filter out comments and images, only store the actual responses
# #         if question.startswith("responses"):
# #             q_key = question.split("[")[1][:-1]
# #             response_value = response
# #             comment = data.get(f'comments[{q_key}]', '')
# #             image = files.get(f'images[{q_key}]')

# #             # Handle image file saving
# #             image_filename = None
# #             if image:
# #                 image_filename = secure_filename(image.filename)
# #                 image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
# #                 image.save(image_path)

# #             # Append the question, response, comment, and image file path
# #             new_data.append({
# #                 "question": q_key,
# #                 "response": response_value,
# #                 "comment": comment,
# #                 "image_path": image_filename or ''
# #             })

# #     # Convert the new data into a DataFrame
# #     df_new = pd.DataFrame(new_data)

# #     # Append the new data to the responses.csv file
# #     if not os.path.exists(RESPONSES_CSV_PATH):
# #         df_new.to_csv(RESPONSES_CSV_PATH, index=False)  # Create the file if it doesn't exist
# #     else:
# #         df_new.to_csv(RESPONSES_CSV_PATH, mode='a', header=False, index=False)  # Append if it exists

# #     return jsonify({"status": "success", "message": "Responses saved to responses.csv"})

# # if __name__ == '__main__':
# #     app.run(debug=True)


# # from flask import Flask, jsonify, request
# # from flask_cors import CORS
# # import pandas as pd
# # import os
# # from werkzeug.utils import secure_filename

# # app = Flask(__name__)
# # CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# # # Paths to the CSV files
# # DATA_CSV_PATH = os.path.join(os.path.dirname(__file__), 'questions.csv')
# # HEADER_CSV_PATH = os.path.join(os.path.dirname(__file__), 'audit_header.csv')  # New CSV for audit header
# # RESPONSES_CSV_PATH = os.path.join(os.path.dirname(__file__), 'responses.csv')
# # UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')

# # # Ensure the uploads directory exists
# # if not os.path.exists(UPLOAD_FOLDER):
# #     os.makedirs(UPLOAD_FOLDER)

# # app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# # # Function to load audit header data from CSV
# # def load_header_data():
# #     df = pd.read_csv(HEADER_CSV_PATH)
# #     header_data = []
# #     for _, row in df.iterrows():
# #         header_data.append({
# #             "id": row['id'],
# #             "question": row['question']
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
# #         information = row.get('information', '')  # Optional info column

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
# #             "information": information
# #         })

# #     return hierarchical_data

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
# #     data = request.form  # Form data
# #     files = request.files  # Uploaded files

# #     # Prepare the data for the responses.csv
# #     new_data = []

# #     for question, response in data.items():
# #         if question.startswith("responses"):
# #             q_key = question.split("[")[1][:-1]
# #             response_value = response
# #             comment = data.get(f'comments[{q_key}]', '')
# #             image = files.get(f'images[{q_key}]')

# #             # Handle image file saving
# #             image_filename = None
# #             if image:
# #                 image_filename = secure_filename(image.filename)
# #                 image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
# #                 image.save(image_path)

# #             # Append the question, response, comment, and image file path
# #             new_data.append({
# #                 "question": q_key,
# #                 "response": response_value,
# #                 "comment": comment,
# #                 "image_path": image_filename or ''
# #             })

# #     # Convert the new data into a DataFrame
# #     df_new = pd.DataFrame(new_data)

# #     # Append the new data to the responses.csv file
# #     if not os.path.exists(RESPONSES_CSV_PATH):
# #         df_new.to_csv(RESPONSES_CSV_PATH, index=False)
# #     else:
# #         df_new.to_csv(RESPONSES_CSV_PATH, mode='a', header=False, index=False)

# #     return jsonify({"status": "success", "message": "Responses saved to responses.csv"})

# # if __name__ == '__main__':
# #     app.run(debug=True)




# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import pandas as pd
# import os
# from werkzeug.utils import secure_filename

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# # Paths to the CSV files
# DATA_CSV_PATH = os.path.join(os.path.dirname(__file__), 'questions.csv')
# HEADER_CSV_PATH = os.path.join(os.path.dirname(__file__), 'audit_header.csv')  # New CSV for audit header
# RESPONSES_CSV_PATH = os.path.join(os.path.dirname(__file__), 'responses.csv')
# UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')

# # Ensure the uploads directory exists
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)

# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# # Function to load audit header data from CSV
# def load_header_data():
#     df = pd.read_csv(HEADER_CSV_PATH)
#     header_data = []
#     for _, row in df.iterrows():
#         header_data.append({
#             "id": row['id'],
#             "question": row['question']
#         })
#     return header_data

# # Function to load audit detail data
# def load_detail_data():
#     df = pd.read_csv(DATA_CSV_PATH)
#     hierarchical_data = {}
#     for _, row in df.iterrows():
#         id = row['id']
#         chapitre = row['chapitre']
#         sous_chapitre = row['sous_chapitre']
#         paragraphe = row['paragraphe']
#         sous_paragraphe = row['sous_paragraphe']
#         question = row['question']
#         response_type = row['response_type']
#         information = row.get('information', '')  # Optional info column

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

# # Function to load audit header data from CSV
# def load_header_data():
#     df = pd.read_csv(HEADER_CSV_PATH)
#     header_data = []
#     for _, row in df.iterrows():
#         header_data.append({
#             "id": row['id'],
#             "question": row['question'],
#             "type": row['type'],
#             "default_value": row.get('default_value', '')
#         })
#     return header_data

# # API route to fetch audit header data
# @app.route('/api/audit_header', methods=['GET'])
# def get_audit_header():
#     header_data = load_header_data()
#     return jsonify(header_data)

# # API route to submit form responses and save to responses.csv (Updated to handle audit header)
# @app.route('/api/submit', methods=['POST'])
# def submit_responses():
#     data = request.form  # Form data
#     files = request.files  # Uploaded files

#     # Handle audit header responses
#     audit_header_responses = []
#     for key, value in data.items():
#         if key.startswith("header"):
#             q_key = key.split("[")[1][:-1]
#             audit_header_responses.append({"question": q_key, "response": value})

#     # Prepare the data for the responses.csv (similar to before)
#     # Add logic for saving both audit header and audit detail responses
#     # Convert the new data into a DataFrame and append to responses.csv as before

#     return jsonify({"status": "success", "message": "Responses saved to responses.csv"})


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
#     data = request.form  # Form data
#     files = request.files  # Uploaded files

#     # Prepare the data for the responses.csv
#     new_data = []

#     for question, response in data.items():
#         if question.startswith("responses"):
#             q_key = question.split("[")[1][:-1]
#             response_value = response
#             comment = data.get(f'comments[{q_key}]', '')
#             image = files.get(f'images[{q_key}]')

#             # Handle image file saving
#             image_filename = None
#             if image:
#                 image_filename = secure_filename(image.filename)
#                 image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
#                 image.save(image_path)

#             # Append the question, response, comment, and image file path
#             new_data.append({
#                 "question": q_key,
#                 "response": response_value,
#                 "comment": comment,
#                 "image_path": image_filename or ''
#             })

#     # Convert the new data into a DataFrame
#     df_new = pd.DataFrame(new_data)

#     # Append the new data to the responses.csv file
#     if not os.path.exists(RESPONSES_CSV_PATH):
#         df_new.to_csv(RESPONSES_CSV_PATH, index=False)
#     else:
#         df_new.to_csv(RESPONSES_CSV_PATH, mode='a', header=False, index=False)

#     return jsonify({"status": "success", "message": "Responses saved to responses.csv"})

# if __name__ == '__main__':
#     app.run(debug=True)




from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
from werkzeug.utils import secure_filename
import math
import numpy as np

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
CORS(app, resources={r"/*": {"origins": "*"}})

# Paths to the CSV files
DATA_CSV_PATH = os.path.join(os.path.dirname(__file__), 'questions.csv')
HEADER_CSV_PATH = os.path.join(os.path.dirname(__file__), 'audit_header.csv')  # CSV for audit header
RESPONSES_CSV_PATH = os.path.join(os.path.dirname(__file__), 'responses.csv')
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')

# Ensure the uploads directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Function to load audit header data from CSV
# import math


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


@app.route('/')
def home():
    return 'Hello, this is your app running!'


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

    # Handle audit header responses
    audit_header_responses = []
    for key, value in data.items():
        if key.startswith("header"):
            q_key = key.split("[")[1][:-1]
            audit_header_responses.append({"question": q_key, "response": value})

    # Prepare the data for the responses.csv
    new_data = []

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

            # Append the question, response, comment, and image file path
            new_data.append({
                "question": q_key,
                "response": response_value,
                "comment": comment,
                "image_path": image_filename or ''
            })

    # Convert the new data into a DataFrame
    df_new = pd.DataFrame(new_data)

    # Append the new data to the responses.csv file
    if not os.path.exists(RESPONSES_CSV_PATH):
        df_new.to_csv(RESPONSES_CSV_PATH, index=False)
    else:
        df_new.to_csv(RESPONSES_CSV_PATH, mode='a', header=False, index=False)

    return jsonify({"status": "success", "message": "Responses saved to responses.csv"})

if __name__ == '__main__':
    app.run(debug=True)
