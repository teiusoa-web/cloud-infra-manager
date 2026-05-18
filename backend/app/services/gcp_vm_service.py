import subprocess
from app.core.config import PROJECT_ID, GCLOUD_PATH, DEFAULT_ZONE


def run_cmd(command: list[str]):
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            shell=False
        )

        return {
            "success": result.returncode == 0,
            "command": " ".join(command),
            "stdout": result.stdout,
            "stderr": result.stderr,
            "return_code": result.returncode
        }

    except Exception as e:
        return {
            "success": False,
            "command": " ".join(command),
            "error": str(e)
        }


def list_vms():
    return run_cmd([
        GCLOUD_PATH,
        "compute",
        "instances",
        "list",
        "--project",
        PROJECT_ID,
        "--format=json"
    ])


def create_vm(vm_name: str, zone: str = DEFAULT_ZONE):
    return run_cmd([
        GCLOUD_PATH,
        "compute",
        "instances",
        "create",
        vm_name,
        "--project",
        PROJECT_ID,
        "--zone",
        zone,
        "--machine-type",
        "e2-micro",
        "--image-family",
        "debian-12",
        "--image-project",
        "debian-cloud",
    ])


def delete_vm(vm_name: str, zone: str = DEFAULT_ZONE):
    return run_cmd([
        GCLOUD_PATH,
        "compute",
        "instances",
        "delete",
        vm_name,
        "--project",
        PROJECT_ID,
        "--zone",
        zone,
        "--quiet",
    ])


def start_vm(vm_name: str, zone: str = DEFAULT_ZONE):
    return run_cmd([
        GCLOUD_PATH,
        "compute",
        "instances",
        "start",
        vm_name,
        "--project",
        PROJECT_ID,
        "--zone",
        zone,
    ])


def stop_vm(vm_name: str, zone: str = DEFAULT_ZONE):
    return run_cmd([
        GCLOUD_PATH,
        "compute",
        "instances",
        "stop",
        vm_name,
        "--project",
        PROJECT_ID,
        "--zone",
        zone,
    ])


def reset_vm(vm_name: str, zone: str = DEFAULT_ZONE):
    return run_cmd([
        GCLOUD_PATH,
        "compute",
        "instances",
        "reset",
        vm_name,
        "--project",
        PROJECT_ID,
        "--zone",
        zone,
    ])