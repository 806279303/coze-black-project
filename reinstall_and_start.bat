@echo off
chcp 65001 >nul
echo ========================================
echo   直播运营系统 - 重装依赖并启动
echo ========================================
echo.

REM 检查虚拟环境
if not exist "backend\venv" (
    echo [1/5] 创建 Python 虚拟环境...
    cd backend
    py -3.12 -m venv venv
    cd ..
) else (
    echo [1/5] 虚拟环境已存在，跳过创建
)

echo.
echo [2/5] 激活虚拟环境并安装后端依赖...
cd backend
call venv\Scripts\activate
pip install -r requirements.txt -q
if not exist .env copy .env.example .env
cd ..

echo.
echo [3/5] 安装前端依赖...
cd frontend
if exist node_modules rd /s /q node_modules
npm install -q
cd ..

echo.
echo [4/5] 启动后端服务 (端口 8000)...
cd backend
start "后端服务" cmd /k "venv\Scripts\activate && python -m uvicorn app.main:app --reload --port 8000"
cd ..
timeout /t 3 >nul

echo.
echo [5/5] 启动前端服务 (端口 3000)...
cd frontend
start "前端服务" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   启动完成！
echo ========================================
echo.
echo   前端地址: http://localhost:3000
echo   后端地址: http://localhost:8000
echo   API文档:  http://localhost:8000/docs
echo.
echo   请在前端启动后手动刷新浏览器
echo ========================================
pause
