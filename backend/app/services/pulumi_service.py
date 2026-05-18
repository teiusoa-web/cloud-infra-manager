import os
import subprocess
from pathlib import Path

from app.core.config import (
    PROJECT_ID,
    DEFAULT_ZONE,
    PULUMI_STACK,
    PULUMI_CONFIG_PASSPHRASE,
)

INFRA_DIR = Path(__file__).resolve().parents[3] / "infra"


def run_pulumi_cmd(command: list[str]):
    env = os.environ.copy()
    env["PULUMI_CONFIG_PASSPHRASE"] = PULUMI_CONFIG_PASSPHRASE

    try:
        subprocess.run(
            ["mkdir", "-p", "/tmp/pulumi"],
            capture_output=True,
            text=True,
        )

        subprocess.run(
            ["pulumi", "login", "file:///tmp/pulumi"],
            cwd=INFRA_DIR,
            capture_output=True,
            text=True,
            env=env,
        )

        stack_select = subprocess.run(
            ["pulumi", "stack", "select", PULUMI_STACK],
            cwd=INFRA_DIR,
            capture_output=True,
            text=True,
            env=env,
        )

        if stack_select.returncode != 0:
            subprocess.run(
                ["pulumi", "stack", "init", PULUMI_STACK],
                cwd=INFRA_DIR,
                capture_output=True,
                text=True,
                env=env,
            )

        subprocess.run(
            ["pulumi", "config", "set", "gcp:project", PROJECT_ID],
            cwd=INFRA_DIR,
            capture_output=True,
            text=True,
            env=env,
        )

        subprocess.run(
            ["pulumi", "config", "set", "gcp:region", "asia-southeast1"],
            cwd=INFRA_DIR,
            capture_output=True,
            text=True,
            env=env,
        )

        subprocess.run(
            ["pulumi", "config", "set", "gcp:zone", DEFAULT_ZONE],
            cwd=INFRA_DIR,
            capture_output=True,
            text=True,
            env=env,
        )

        result = subprocess.run(
            command,
            cwd=INFRA_DIR,
            capture_output=True,
            text=True,
            shell=False,
            env=env,
        )

        return {
            "success": result.returncode == 0,
            "command": " ".join(command),
            "cwd": str(INFRA_DIR),
            "stdout": result.stdout,
            "stderr": result.stderr,
            "return_code": result.returncode,
        }

    except Exception as e:
        return {
            "success": False,
            "command": " ".join(command),
            "cwd": str(INFRA_DIR),
            "error": str(e),
        }


def pulumi_preview():
    return run_pulumi_cmd(["pulumi", "preview"])


def pulumi_up():
    return run_pulumi_cmd(["pulumi", "up", "--yes"])


def pulumi_destroy():
    return run_pulumi_cmd(["pulumi", "destroy", "--yes"])


def pulumi_stack_output():
    return run_pulumi_cmd(["pulumi", "stack", "output", "--json"])