Write-Host "======================================="
Write-Host " Cloud Infra Manager Startup"
Write-Host "======================================="

if (!(Test-Path "backend/.env")) {
@"
PROJECT_ID=pulumi-cloud-project
DEFAULT_ZONE=asia-southeast1-a
GCLOUD_PATH=gcloud
PULUMI_STACK=dev
PULUMI_CONFIG_PASSPHRASE=change-this-passphrase
"@ | Out-File -Encoding utf8 "backend/.env"

    Write-Host "Created backend/.env"
    Write-Host "Please edit backend/.env and set your PROJECT_ID if needed."
}

if (!(Test-Path ".venv")) {
    Write-Host "Creating Python virtual environment..."
    python -m venv .venv

    Write-Host "Installing backend dependencies..."
    .\.venv\Scripts\python.exe -m pip install --upgrade pip

    if (Test-Path "backend/requirements.txt") {
        .\.venv\Scripts\pip.exe install -r backend/requirements.txt
    }

    Write-Host ".venv ready"
}

Write-Host "Stopping old containers..."
docker compose down

Write-Host "Building and starting containers..."
docker compose up --build -d

Write-Host "Waiting for backend..."

$backendReady = $false

for ($i = 1; $i -le 30; $i++) {
    Start-Sleep -Seconds 2

    try {
        $backend = Invoke-WebRequest `
            -Uri "http://localhost:8000/health" `
            -UseBasicParsing

        if ($backend.StatusCode -eq 200) {
            $backendReady = $true
            break
        }
    }
    catch {}
}

if (!$backendReady) {
    Write-Host "Backend failed to start."
    Write-Host "Run this to check logs:"
    Write-Host "docker compose logs backend"
    exit 1
}

Write-Host "Backend is ready."

Write-Host "Waiting for frontend..."

$frontendReady = $false

for ($i = 1; $i -le 30; $i++) {
    Start-Sleep -Seconds 2

    try {
        $frontend = Invoke-WebRequest `
            -Uri "http://localhost:5173" `
            -UseBasicParsing

        if ($frontend.StatusCode -eq 200) {
            $frontendReady = $true
            break
        }
    }
    catch {}
}

if (!$frontendReady) {
    Write-Host "Frontend failed to start."
    Write-Host "Run this to check logs:"
    Write-Host "docker compose logs frontend"
    exit 1
}

Write-Host "Frontend is ready."

Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "======================================="
Write-Host " Cloud Infra Manager is running!"
Write-Host "======================================="
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend : http://localhost:8000/docs"
