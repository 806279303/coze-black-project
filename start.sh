#!/bin/bash
echo "========================================"
echo "  直播运营系统 - 启动脚本"
echo "========================================"
echo

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "[错误] 未找到 Python，请先安装 Python 3.10+"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "[错误] 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "[1/4] 安装后端依赖..."
cd backend
pip3 install -r requirements.txt -q

echo "[2/4] 安装前端依赖..."
cd ../frontend
npm install --silent

echo "[3/4] 启动后端服务..."
cd ../backend
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

echo "[4/4] 启动前端服务..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo
echo "========================================"
echo "  启动完成！"
echo "  前端: http://localhost:3000"
echo "  后端: http://localhost:8000"
echo "========================================"
echo

# 等待进程
wait $BACKEND_PID $FRONTEND_PID
