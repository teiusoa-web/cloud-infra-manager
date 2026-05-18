import subprocess
from pathlib import Path

INFRA_DIR = Path(__file__).resolve().parents[3] / "infra"


def run_pulumi_cmd(command: list[str]):
    try:
        result = subprocess.run(
            command,
            cwd=INFRA_DIR,
            capture_output=True,
            text=True,
            shell=False
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