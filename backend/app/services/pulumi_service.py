import subprocess
from pathlib import Path
import os

INFRA_DIR = Path(__file__).resolve().parents[3] / "infra"


def run_pulumi_cmd(command: list[str]):
    try:
        # Pulumi local backend
        subprocess.run(
            ["pulumi", "login", "file:///tmp/pulumi"],
            cwd=INFRA_DIR,
            capture_output=True,
            text=True,
        )

        # Set passphrase
        env = os.environ.copy()
        env["PULUMI_CONFIG_PASSPHRASE"] = "1234"

        # Kiểm tra stack
        stack_check = subprocess.run(
            ["pulumi", "stack", "select", "dev"],
            cwd=INFRA_DIR,
            capture_output=True,
            text=True,
            env=env
        )

        # Nếu chưa có stack thì tạo
        if stack_check.returncode != 0:
            subprocess.run(
                ["pulumi", "stack", "init", "dev"],
                cwd=INFRA_DIR,
                capture_output=True,
                text=True,
                env=env
            )

            subprocess.run(
                ["pulumi", "config", "set", "gcp:project", "pulumi-cloud-project"],
                cwd=INFRA_DIR,
                capture_output=True,
                text=True,
                env=env
            )

            subprocess.run(
                ["pulumi", "config", "set", "gcp:region", "asia-southeast1"],
                cwd=INFRA_DIR,
                capture_output=True,
                text=True,
                env=env
            )

            subprocess.run(
                ["pulumi", "config", "set", "gcp:zone", "asia-southeast1-a"],
                cwd=INFRA_DIR,
                capture_output=True,
                text=True,
                env=env
            )

        # Run command
        result = subprocess.run(
            command,
            cwd=INFRA_DIR,
            capture_output=True,
            text=True,
            shell=False,
            env=env
        )

        return {
            "success": result.returncode == 0,
            "command": " ".join(command),
            "cwd": str(INFRA_DIR),
            "stdout": result.stdout,
            "stderr": result.stderr,
            "return_code": result.returncode
        }

    except Exception as e:
        return {
            "success": False,
            "command": " ".join(command),
            "cwd": str(INFRA_DIR),
            "error": str(e)
        }


def pulumi_preview():
    return run_pulumi_cmd(["pulumi", "preview"])


def pulumi_up():
    return run_pulumi_cmd(["pulumi", "up", "--yes"])


def pulumi_destroy():
    return run_pulumi_cmd(["pulumi", "destroy", "--yes"])


def pulumi_stack_output():
    return run_pulumi_cmd(["pulumi", "stack", "output", "--json"])