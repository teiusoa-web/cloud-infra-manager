Write-Host "Stopping old containers..."
docker compose down

Write-Host "Building and starting containers..."
docker compose up --build -d

Write-Host "Waiting for backend..."
do {
    Start-Sleep -Seconds 2
    try {
        $backend = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
    } catch {
        $backend = $null
    }
} until ($backend.StatusCode -eq 200)

Write-Host "Backend is ready."

Write-Host "Waiting for frontend..."
do {
    Start-Sleep -Seconds 2
    try {
        $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing
    } catch {
        $frontend = $null
    }
} until ($frontend.StatusCode -eq 200)

Write-Host "Frontend is ready."

Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Cloud Infra Manager is running!"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend : http://localhost:8000/docs"