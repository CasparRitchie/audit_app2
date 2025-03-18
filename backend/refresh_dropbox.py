# import os
# import requests

# # Environment variables
# APP_KEY = os.getenv("DROPBOX_APP_KEY")
# APP_SECRET = os.getenv("DROPBOX_APP_SECRET")
# REFRESH_TOKEN = os.getenv("DROPBOX_REFRESH_TOKEN")

# def refresh_access_token(app_key, app_secret, refresh_token):
#     url = "https://api.dropboxapi.com/oauth2/token"
#     data = {
#         "grant_type": "refresh_token",
#         "refresh_token": refresh_token,
#         "client_id": app_key,
#         "client_secret": app_secret,
#     }

#     response = requests.post(url, data=data)
#     if response.status_code == 200:
#         token_data = response.json()
#         access_token = token_data.get("access_token")
#         expires_in = token_data.get("expires_in")
#         print(f"New Access Token: {access_token}")
#         print(f"Expires In: {expires_in} seconds")
#         return access_token
#     else:
#         print(f"Failed to refresh token: {response.status_code}")
#         print(response.json())
#         return None

# if __name__ == "__main__":
#     if not APP_KEY or not APP_SECRET or not REFRESH_TOKEN:
#         print("Ensure that APP_KEY, APP_SECRET, and REFRESH_TOKEN are set in the environment variables.")
#     else:
#         new_token = refresh_access_token(APP_KEY, APP_SECRET, REFRESH_TOKEN)
#         if new_token:
#             # Optionally, update the .env file or environment
#             print("Successfully refreshed the access token.")
