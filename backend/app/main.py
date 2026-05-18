from fastapi import FastAPI
from app.api.vm_routes import router as vm_router

app = FastAPI(title="Cloud Infra Manager")

app.include_router(vm_router)


@app.get("/")
def home():
    return {
        "message": "Cloud Infra Manager API is running"
    }