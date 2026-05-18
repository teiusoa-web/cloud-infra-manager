from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.vm_routes import router as vm_router

app = FastAPI(
    title="Cloud Infra Manager API",
    description="FastAPI backend quản lý VM Google Cloud",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vm_router)


@app.get("/")
def home():
    return {
        "message": "Cloud Infra Manager API is running"
    }