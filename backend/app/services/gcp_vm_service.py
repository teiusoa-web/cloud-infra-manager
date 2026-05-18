import json
import subprocess

PROJECT_ID = "pulumi-cloud-project"

GCLOUD = r"C:\Users\Cpeach\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"


def run_gcloud_command(command):
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True
        )

        return {
            "success": result.returncode == 0,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def list_vms():
    command = [
        GCLOUD,
        "compute",
        "instances",
        "list",
        "--project",
        PROJECT_ID,
        "--format=json"
    ]

    result = run_gcloud_command(command)

    if result["success"]:
        result["data"] = json.loads(result["stdout"])

    return result


def create_vm(vm_name, zone):
    command = [
        GCLOUD,
        "compute",
        "instances",
        "create",
        vm_name,
        "--zone",
        zone,
        "--machine-type",
        "e2-micro",
        "--project",
        PROJECT_ID
    ]

    return run_gcloud_command(command)


def start_vm(vm_name, zone):
    command = [
        GCLOUD,
        "compute",
        "instances",
        "start",
        vm_name,
        "--zone",
        zone,
        "--project",
        PROJECT_ID
    ]

    return run_gcloud_command(command)


def stop_vm(vm_name, zone):
    command = [
        GCLOUD,
        "compute",
        "instances",
        "stop",
        vm_name,
        "--zone",
        zone,
        "--project",
        PROJECT_ID
    ]

    return run_gcloud_command(command)


def reset_vm(vm_name, zone):
    command = [
        GCLOUD,
        "compute",
        "instances",
        "reset",
        vm_name,
        "--zone",
        zone,
        "--project",
        PROJECT_ID
    ]

    return run_gcloud_command(command)


def delete_vm(vm_name, zone):
    command = [
        GCLOUD,
        "compute",
        "instances",
        "delete",
        vm_name,
        "--zone",
        zone,
        "--quiet",
        "--project",
        PROJECT_ID
    ]

    return run_gcloud_command(command)