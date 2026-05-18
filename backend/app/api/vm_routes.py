from fastapi import APIRouter, Body

from app.services.gcp_vm_service import (
    list_vms,
    create_vm,
    delete_vm,
    start_vm,
    stop_vm,
    reset_vm,
)

router = APIRouter(
    prefix="/vms",
    tags=["VM Management"]
)


@router.get("/")
def get_vms():
    return list_vms()


@router.post("/create")
def create(data: dict = Body(...)):
    vm_name = data.get("name")
    zone = data.get("zone")

    if not vm_name:
        return {
            "success": False,
            "message": "VM name is required"
        }

    return create_vm(vm_name, zone)


@router.post("/{zone}/{vm_name}/start")
def start(zone: str, vm_name: str):
    return start_vm(vm_name, zone)


@router.post("/{zone}/{vm_name}/stop")
def stop(zone: str, vm_name: str):
    return stop_vm(vm_name, zone)


@router.post("/{zone}/{vm_name}/reset")
def reset(zone: str, vm_name: str):
    return reset_vm(vm_name, zone)


@router.delete("/{zone}/{vm_name}")
def delete(zone: str, vm_name: str):
    return delete_vm(vm_name, zone)