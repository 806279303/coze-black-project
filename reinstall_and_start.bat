@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM Set log file
set LOG_FILE=install_log_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%.txt
set LOG_FILE=%LOG_FILE: =0%

echo ======================================== > %LOG_FILE%
echo   Live Ops System - Install Log >> %LOG_FILE%
echo   Time: %date% %time% >> %LOG_FILE%
echo ======================================== >> %LOG_FILE%
echo. >> %LOG_FILE%

echo ========================================
echo   Live Ops System - Reinstall and Start
echo   Log file: %LOG_FILE%
echo ========================================
echo.

REM ========== Step 1: Create venv ==========
echo [1/6] Checking Python virtual environment...
echo [1/6] Checking Python virtual environment... >> %LOG_FILE%

if not exist "backend\venv" (
    echo       Creating virtual environment...
    echo       Creating virtual environment... >> %LOG_FILE%
    
    cd backend
    py -3.12 -m venv venv >> ..\%LOG_FILE% 2>&1
    
    if !errorlevel! neq 0 (
        echo.
        echo ========================================
        echo   [ERROR] Failed to create virtual environment!
        echo ========================================
        echo.
        echo   Possible reasons:
        echo   1. Python 3.12 not installed
        echo   2. Python not in PATH
        echo.
        echo   Solution:
        echo   Download Python 3.12: https://www.python.org/ftp/python/3.12.8/python-3.12.8-amd64.exe
        echo   Check "Add Python to PATH" during installation
        echo.
        echo   Log file: %LOG_FILE%
        echo ========================================
        cd ..
        goto error_exit
    )
    cd ..
    echo       [OK] Virtual environment created
    echo       [OK] Virtual environment created >> %LOG_FILE%
) else (
    echo       [SKIP] Virtual environment already exists
    echo       [SKIP] Virtual environment already exists >> %LOG_FILE%
)

echo. >> %LOG_FILE%

REM ========== Step 2: Install backend deps ==========
echo [2/6] Installing backend dependencies...
echo [2/6] Installing backend dependencies... >> %LOG_FILE%

cd backend
echo       Activating virtual environment...
call venv\Scripts\activate.bat

echo       Installing dependencies (may take a few minutes)...
echo       Installing dependencies... >> ..\%LOG_FILE%

REM Set UTF-8 encoding for pip
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8

pip install -r requirements.txt > pip_output.txt 2>&1
set PIP_ERROR=!errorlevel!
type pip_output.txt >> ..\%LOG_FILE%

if !PIP_ERROR! neq 0 (
    echo.
    echo ========================================
    echo   [ERROR] Backend dependencies install failed!
    echo ========================================
    echo.
    echo   Error details:
    type pip_output.txt
    echo.
    echo   Possible reasons:
    echo   1. Network connection issue
    echo   2. pip version too old
    echo   3. Dependency conflict
    echo.
    echo   Try solutions:
    echo   pip install --upgrade pip
    echo   pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
    echo.
    echo   Log file: %LOG_FILE%
    echo ========================================
    del pip_output.txt
    cd ..
    goto error_exit
)

del pip_output.txt

echo       Copying environment config...
if not exist .env (
    copy .env.example .env >> ..\%LOG_FILE% 2>&1
    echo       [OK] Created .env file
    echo       [OK] Created .env file >> ..\%LOG_FILE%
) else (
    echo       [SKIP] .env file already exists
    echo       [SKIP] .env file already exists >> ..\%LOG_FILE%
)

cd ..
echo       [OK] Backend dependencies installed
echo       [OK] Backend dependencies installed >> %LOG_FILE%

echo. >> %LOG_FILE%

REM ========== Step 3: Install frontend deps ==========
echo [3/6] Installing frontend dependencies...
echo [3/6] Installing frontend dependencies... >> %LOG_FILE%

cd frontend
if exist node_modules (
    echo       Cleaning old node_modules...
    rd /s /q node_modules 2>nul
)
if exist package-lock.json (
    del package-lock.json 2>nul
)

echo       Installing dependencies (may take a few minutes)...
echo       Installing dependencies... >> ..\%LOG_FILE%

npm install > npm_output.txt 2>&1
set NPM_ERROR=!errorlevel!
type npm_output.txt >> ..\%LOG_FILE%

if !NPM_ERROR! neq 0 (
    echo.
    echo ========================================
    echo   [ERROR] Frontend dependencies install failed!
    echo ========================================
    echo.
    echo   Error details:
    type npm_output.txt
    echo.
    echo   Possible reasons:
    echo   1. Node.js not installed
    echo   2. Network connection issue
    echo   3. npm registry slow
    echo.
    echo   Try solutions:
    echo   npm install -g cnpm --registry=https://registry.npmmirror.com
    echo   cnpm install
    echo.
    echo   Log file: %LOG_FILE%
    echo ========================================
    del npm_output.txt
    cd ..
    goto error_exit
)

del npm_output.txt
cd ..
echo       [OK] Frontend dependencies installed
echo       [OK] Frontend dependencies installed >> %LOG_FILE%

echo. >> %LOG_FILE%

REM ========== Step 4: Check ports ==========
echo [4/6] Checking port availability...
echo [4/6] Checking port availability... >> %LOG_FILE%

set PORT_WARNING=0
netstat -ano | findstr ":8000 " >nul
if !errorlevel! equ 0 (
    echo       [WARN] Port 8000 is in use
    echo       [WARN] Port 8000 is in use >> %LOG_FILE%
    set PORT_WARNING=1
)

netstat -ano | findstr ":3000 " >nul
if !errorlevel! equ 0 (
    echo       [WARN] Port 3000 is in use
    echo       [WARN] Port 3000 is in use >> %LOG_FILE%
    set PORT_WARNING=1
)

if !PORT_WARNING! equ 0 (
    echo       [OK] Ports are available
    echo       [OK] Ports are available >> %LOG_FILE%
)

echo. >> %LOG_FILE%

REM ========== Step 5: Start backend ==========
echo [5/6] Starting backend service...
echo [5/6] Starting backend service... >> %LOG_FILE%

cd backend
start "Backend Service" cmd /k "venv\Scripts\activate && set PYTHONUTF8=1 && python -m uvicorn app.main:app --reload --port 8000"
cd ..

echo       Waiting for backend to start (5s)...
timeout /t 5 >nul

curl -s http://localhost:8000/ >nul 2>&1
if !errorlevel! equ 0 (
    echo       [OK] Backend service started
    echo       [OK] Backend service started >> %LOG_FILE%
) else (
    echo       [WARN] Backend service may not be running, check backend window
    echo       [WARN] Backend service may not be running >> %LOG_FILE%
)

echo. >> %LOG_FILE%

REM ========== Step 6: Start frontend ==========
echo [6/6] Starting frontend service...
echo [6/6] Starting frontend service... >> %LOG_FILE%

cd frontend
start "Frontend Service" cmd /k "npm run dev"
cd ..

echo       Waiting for frontend to start (5s)...
timeout /t 5 >nul

echo. >> %LOG_FILE%

REM ========== Done ==========
echo.
echo ========================================
echo   Installation complete!
echo ========================================
echo.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo   Log file: %LOG_FILE%
echo ========================================
echo.
echo   Press any key to exit...
pause >nul
exit /b 0

REM ========== Error exit ==========
:error_exit
echo.
echo ========================================
echo   Error occurred, installation stopped!
echo ========================================
echo.
echo   Please screenshot the error above and send to xiaov
echo   Log file: %LOG_FILE%
echo.
echo   Press any key to exit...
pause >nul
exit /b 1
