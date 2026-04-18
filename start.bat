@echo off
echo ========================================
echo   直播运营系统 - 启动脚本
echo ========================================
echo.

:: 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Python，请先安装 Python 3.10+
    pause
    exit /b 1
)

:: 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Node.js，请先安装 Node.js 18+
    pause
    exit /b 1
)

echo [1/4] 安装后端依赖...
cd backend
pip install -r requirements.txt -q

echo [2/4] 安装前端依赖...
cd ..\frontend
call npm install --silent

echo [3/4] 启动后端服务...
cd ..\backend
start "后端服务" cmd /k "uvicorn app.main:app --reload --port 8000"

echo [4/4] 启动前端服务...
cd ..\frontend
start "前端服务" cmd /k "npm run dev"

echo.
echo ========================================
echo   启动完成！
echo   前端: http://localhost:3000
echo   后端: http://localhost:8000
echo ========================================
echo.
pause
