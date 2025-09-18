@echo off
title Sweet Shop Management System
echo Starting Sweet Shop Management System...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /c "cd backend && npm start"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /c "cd frontend && npm start"

echo.
echo ✅ Both servers are starting up!
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul