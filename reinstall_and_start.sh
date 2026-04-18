#!/bin/bash

echo "========================================"
echo "  直播运营系统 - 重装依赖并启动"
echo "========================================"
echo

# 检查虚拟环境
if [ ! -d "backend/venv" ]; then
    echo "[1/5] 创建 Python 虚拟环境..."
    cd backend
    python3 -m venv venv
    cd ..
else
    echo "[1/5] 虚拟环境已存在，跳过创建"
fi

echo
echo "[2/5] 激活虚拟环境并安装后端依赖..."
cd backend
source venv/bin/activate
pip install -r requirements.txt -q
[ ! -f .env ] && cp .env.example .env
cd ..

echo
echo "[3/5] 安装前端依赖..."
cd frontend
rm -rf node_modules package-lock.json
npm install -q
cd ..

echo
echo "[4/5] 启动后端服务 (端口 8000)..."
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..
sleep 2

echo
echo "[5/5] 启动前端服务 (端口 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo
echo "========================================"
echo "  启动完成！"
echo "========================================"
echo
echo "  前端地址: http://localhost:3000"
echo "  后端地址: http://localhost:8000"
echo "  API文档:  http://localhost:8000/docs"
echo
echo "  按 Ctrl+C 停止服务"
echo "========================================"

# 等待子进程
wait
