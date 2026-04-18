@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 设置日志文件
set LOG_FILE=安装启动日志_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%.txt
set LOG_FILE=%LOG_FILE: =0%

echo ======================================== > %LOG_FILE%
echo   直播运营系统 - 安装启动日志 >> %LOG_FILE%
echo   时间: %date% %time% >> %LOG_FILE%
echo ======================================== >> %LOG_FILE%
echo. >> %LOG_FILE%

echo ========================================
echo   直播运营系统 - 重装依赖并启动
echo   日志文件: %LOG_FILE%
echo ========================================
echo.

REM ========== 第一步：创建虚拟环境 ==========
echo [1/6] 检查/创建 Python 虚拟环境...
echo [1/6] 检查/创建 Python 虚拟环境... >> %LOG_FILE%

if not exist "backend\venv" (
    echo       创建虚拟环境中...
    echo       创建虚拟环境中... >> %LOG_FILE%
    
    cd backend
    py -3.12 -m venv venv > ..\%LOG_FILE% 2>&1
    if !errorlevel! neq 0 (
        echo       [错误] 创建虚拟环境失败！
        echo       [错误] 创建虚拟环境失败！ >> ..\%LOG_FILE%
        echo       请检查是否安装了 Python 3.12 >> ..\%LOG_FILE%
        goto error_exit
    )
    cd ..
    echo       [成功] 虚拟环境创建完成
    echo       [成功] 虚拟环境创建完成 >> %LOG_FILE%
) else (
    echo       [跳过] 虚拟环境已存在
    echo       [跳过] 虚拟环境已存在 >> %LOG_FILE%
)

echo. >> %LOG_FILE%

REM ========== 第二步：安装后端依赖 ==========
echo [2/6] 安装后端依赖...
echo [2/6] 安装后端依赖... >> %LOG_FILE%

cd backend
echo       激活虚拟环境...
call venv\Scripts\activate.bat

echo       安装依赖中（可能需要几分钟）...
echo       安装依赖中... >> ..\%LOG_FILE%

pip install -r requirements.txt >> ..\%LOG_FILE% 2>&1
if !errorlevel! neq 0 (
    echo       [错误] 后端依赖安装失败！
    echo       [错误] 后端依赖安装失败！ >> ..\%LOG_FILE%
    cd ..
    goto error_exit
)

echo       复制环境配置文件...
if not exist .env (
    copy .env.example .env >> ..\%LOG_FILE% 2>&1
    echo       [成功] 已创建 .env 文件
    echo       [成功] 已创建 .env 文件 >> ..\%LOG_FILE%
) else (
    echo       [跳过] .env 文件已存在
    echo       [跳过] .env 文件已存在 >> ..\%LOG_FILE%
)

cd ..
echo       [成功] 后端依赖安装完成
echo       [成功] 后端依赖安装完成 >> %LOG_FILE%

echo. >> %LOG_FILE%

REM ========== 第三步：安装前端依赖 ==========
echo [3/6] 安装前端依赖...
echo [3/6] 安装前端依赖... >> %LOG_FILE%

cd frontend
if exist node_modules (
    echo       清理旧的 node_modules...
    rd /s /q node_modules 2>nul
)
if exist package-lock.json (
    del package-lock.json 2>nul
)

echo       安装依赖中（可能需要几分钟）...
echo       安装依赖中... >> ..\%LOG_FILE%

npm install >> ..\%LOG_FILE% 2>&1
if !errorlevel! neq 0 (
    echo       [错误] 前端依赖安装失败！
    echo       [错误] 前端依赖安装失败！ >> ..\%LOG_FILE%
    cd ..
    goto error_exit
)

cd ..
echo       [成功] 前端依赖安装完成
echo       [成功] 前端依赖安装完成 >> %LOG_FILE%

echo. >> %LOG_FILE%

REM ========== 第四步：检查端口占用 ==========
echo [4/6] 检查端口占用...
echo [4/6] 检查端口占用... >> %LOG_FILE%

netstat -ano | findstr ":8000 " >nul
if !errorlevel! equ 0 (
    echo       [警告] 端口 8000 已被占用，后端可能启动失败
    echo       [警告] 端口 8000 已被占用 >> %LOG_FILE%
)

netstat -ano | findstr ":3000 " >nul
if !errorlevel! equ 0 (
    echo       [警告] 端口 3000 已被占用，前端可能启动失败
    echo       [警告] 端口 3000 已被占用 >> %LOG_FILE%
)

echo       [成功] 端口检查完成
echo       [成功] 端口检查完成 >> %LOG_FILE%

echo. >> %LOG_FILE%

REM ========== 第五步：启动后端服务 ==========
echo [5/6] 启动后端服务...
echo [5/6] 启动后端服务... >> %LOG_FILE%

cd backend
start "直播运营系统-后端服务" cmd /k "venv\Scripts\activate && python -m uvicorn app.main:app --reload --port 8000"
cd ..

echo       等待后端启动...
timeout /t 5 >nul

REM 检查后端是否启动成功
curl -s http://localhost:8000/ >nul 2>&1
if !errorlevel! equ 0 (
    echo       [成功] 后端服务启动成功
    echo       [成功] 后端服务启动成功 >> %LOG_FILE%
) else (
    echo       [警告] 后端服务可能未启动成功，请检查后端窗口
    echo       [警告] 后端服务可能未启动成功 >> %LOG_FILE%
)

echo. >> %LOG_FILE%

REM ========== 第六步：启动前端服务 ==========
echo [6/6] 启动前端服务...
echo [6/6] 启动前端服务... >> %LOG_FILE%

cd frontend
start "直播运营系统-前端服务" cmd /k "npm run dev"
cd ..

echo       等待前端启动...
timeout /t 5 >nul

echo. >> %LOG_FILE%

REM ========== 完成 ==========
echo.
echo ========================================
echo   安装启动完成！
echo ========================================
echo.
echo   前端地址: http://localhost:3000
echo   后端地址: http://localhost:8000
echo   API文档:  http://localhost:8000/docs
echo.
echo   日志文件: %LOG_FILE%
echo   如有问题请查看日志文件或截图发给我
echo ========================================
echo.
echo   按任意键退出...
pause >nul
exit /b 0

REM ========== 错误退出 ==========
:error_exit
echo.
echo ========================================
echo   [失败] 安装过程中出现错误！
echo ========================================
echo.
echo   请查看日志文件: %LOG_FILE%
echo   或将日志内容发给我分析
echo.
echo   常见问题：
echo   1. Python 3.12 未安装
echo   2. Node.js 未安装
echo   3. 网络连接问题
echo.
echo   按任意键退出...
pause >nul
exit /b 1
