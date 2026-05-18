from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.vm_routes import router as vm_router
from app.api.pulumi_routes import router as pulumi_router

app = FastAPI(
    title="Cloud Infra Manager API",
    description="Manage cloud infrastructure using FastAPI, Python and Pulumi",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vm_router)
app.include_router(pulumi_router)


@app.get("/")
def home():
    return {
        "message": "Cloud Infra Manager API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "backend",
        "message": "API is healthy"
    }   