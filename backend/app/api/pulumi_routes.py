from fastapi import APIRouter

from app.services.pulumi_service import (
    pulumi_preview,
    pulumi_up,
    pulumi_destroy,
    pulumi_stack_output,
)

router = APIRouter(
    prefix="/infra",
    tags=["Pulumi Infrastructure"]
)


@router.get("/preview")
def preview():
    return pulumi_preview()


@router.post("/up")
def up():
    return pulumi_up()


@router.post("/destroy")
def destroy():
    return pulumi_destroy()


@router.get("/outputs")
def outputs():
    return pulumi_stack_output()