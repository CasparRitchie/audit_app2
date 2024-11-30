from dotenv import load_dotenv
import os

def update_environment():
    # Load the .env file
    load_dotenv()

    # Print updated environment variables to confirm
    print(f"DROPBOX_APP_KEY: {os.getenv('DROPBOX_APP_KEY')}")
    print(f"DROPBOX_APP_SECRET: {os.getenv('DROPBOX_APP_SECRET')}")
    print(f"DROPBOX_ACCESS_TOKEN: {os.getenv('DROPBOX_ACCESS_TOKEN')}")
    print(f"DROPBOX_REFRESH_TOKEN: {os.getenv('DROPBOX_REFRESH_TOKEN')}")
    print(f"HEROKU_API_KEY: {os.getenv('HEROKU_API_KEY')}")
    print(f"HEROKU_APP_NAME: {os.getenv('HEROKU_APP_NAME')}")

if __name__ == "__main__":
    update_environment()
