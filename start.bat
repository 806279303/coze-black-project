@echo off
chcp 65001 >nul
echo ========================================
echo   Live Ops System - Quick Start
echo ========================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found, please install Python 3.12+
    pause
    exit /b 1
)

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found, please install Node.js 18+
    pause
    exit /b 1
)

echo [1/4] Installing backend dependencies...
cd backend
set PYTHONUTF8=1
pip install -r requirements.txt -q

echo [2/4] Installing frontend dependencies...
cd ..\frontend
call npm install --silent

echo [3/4] Starting backend service...
cd ..\backend
start "Backend Service" cmd /k "set PYTHONUTF8=1 && python -m uvicorn app.main:app --reload --port 8000"

echo [4/4] Starting frontend service...
cd ..\frontend
start "Frontend Service" cmd /k "npm run dev"

cd ..

echo.
echo ========================================
echo   Start complete!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo ========================================
echo.
pause
