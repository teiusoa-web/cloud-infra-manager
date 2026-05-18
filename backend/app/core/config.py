import os
from dotenv import load_dotenv

load_dotenv()

PROJECT_ID = os.getenv("PROJECT_ID", "pulumi-cloud-project")
DEFAULT_ZONE = os.getenv("DEFAULT_ZONE", "asia-southeast1-a")
GCLOUD_PATH = os.getenv("GCLOUD_PATH", "gcloud")

PULUMI_STACK = os.getenv("PULUMI_STACK", "dev")
PULUMI_CONFIG_PASSPHRASE = os.getenv("PULUMI_CONFIG_PASSPHRASE", "1234")