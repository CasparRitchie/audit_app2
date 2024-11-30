import os
import requests

def check_tokens():
    access_token = os.getenv("DROPBOX_ACCESS_TOKEN")
    refresh_token = os.getenv("DROPBOX_REFRESH_TOKEN")
    app_key = os.getenv("DROPBOX_APP_KEY")
    app_secret = os.getenv("DROPBOX_APP_SECRET")

    print(f"Access Token: {access_token}")
    print(f"Refresh Token: {refresh_token}")
    print(f"App Key: {app_key}")
    print(f"App Secret: {app_secret}")

    if not all([access_token, refresh_token, app_key, app_secret]):
        print("Some environment variables are missing.")
        return

    # Test access token validity
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.post("https://api.dropboxapi.com/2/check/user", headers=headers)

    if response.status_code == 200:
        print("Access token is valid!")
    else:
        print(f"Access token is invalid: {response.json()}")

check_tokens()
