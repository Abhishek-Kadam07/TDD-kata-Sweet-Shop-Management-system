# Sweet Shop Management System Startup Script
Write-Host "🍭 Starting Sweet Shop Management System..." -ForegroundColor Cyan
Write-Host ""

# Function to check if port is available
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Check if ports are available
if (Test-Port 3001) {
    Write-Host "⚠️  Port 3001 is already in use. Please stop any running backend server." -ForegroundColor Yellow
    exit
}

if (Test-Port 3000) {
    Write-Host "⚠️  Port 3000 is already in use. Please stop any running frontend server." -ForegroundColor Yellow
    exit
}

Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start" -WindowStyle Normal

Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Green
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Sweet Shop Management System is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 URLs:" -ForegroundColor Cyan
Write-Host "   Backend API:  http://localhost:3001" -ForegroundColor White
Write-Host "   Frontend UI:  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Test Credentials:" -ForegroundColor Cyan
Write-Host "   Admin: admin@sweetshop.com / admin123" -ForegroundColor White
Write-Host "   User:  user@sweetshop.com / user123" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")