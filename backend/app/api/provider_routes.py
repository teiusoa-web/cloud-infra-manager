from fastapi import APIRouter

router = APIRouter(prefix="/providers", tags=["Cloud Providers"])


@router.get("/")
def list_providers():
    return [
        {
            "name": "Google Cloud",
            "code": "gcp",
            "status": "connected",
            "features": ["VM List", "Create VM", "Start/Stop", "Pulumi"]
        },
        {
            "name": "AWS",
            "code": "aws",
            "status": "demo",
            "features": ["EC2", "VPC", "S3"]
        },
        {
            "name": "Azure",
            "code": "azure",
            "status": "demo",
            "features": ["Virtual Machine", "Resource Group", "Storage"]
        }
    ]