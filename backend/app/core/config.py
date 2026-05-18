import os
from dotenv import load_dotenv

load_dotenv()

PROJECT_ID = os.getenv("PROJECT_ID")
GCLOUD_PATH = os.getenv("GCLOUD_PATH", "gcloud")
DEFAULT_ZONE = os.getenv("DEFAULT_ZONE", "asia-southeast1-a")


if not PROJECT_ID:
    raise RuntimeError("PROJECT_ID is missing in .env")