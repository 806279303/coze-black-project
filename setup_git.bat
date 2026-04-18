@echo off
chcp 65001 >nul
echo ========================================
echo   直播运营系统 - Git 仓库初始化
echo ========================================
echo.

REM 检查是否已安装 git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Git，请先安装 Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM 检查是否已安装 gh (GitHub CLI)
where gh >nul 2>nul
set HAS_GH=1
if %errorlevel% neq 0 (
    echo [提示] 未检测到 GitHub CLI (gh)，将使用手动方式
    echo 如需自动创建仓库，可安装 GitHub CLI: https://cli.github.com/
    set HAS_GH=0
)

echo.
echo 请输入您的 GitHub 用户名:
set /p GITHUB_USER=

echo.
echo 请输入仓库名称 (默认: live-ops-system):
set /p REPO_NAME=
if "%REPO_NAME%"=="" set REPO_NAME=live-ops-system

echo.
echo 正在初始化 Git 仓库...

REM 初始化 git
git init
git add .
git commit -m "初始化项目: 直播运营系统 v1.3.0"

echo.
echo Git 仓库初始化完成！
echo.

if "%HAS_GH%"=="1" (
    echo 检测到 GitHub CLI，是否自动创建仓库并推送？ [Y/n]
    set /p AUTO_PUSH=
    if /i "%AUTO_PUSH%"=="n" goto manual
    if /i "%AUTO_PUSH%"=="N" goto manual
    
    echo.
    echo 正在创建 GitHub 仓库并推送...
    gh repo create %REPO_NAME% --public --source=. --push
    
    echo.
    echo ========================================
    echo   完成！仓库已创建并推送
    echo ========================================
    echo.
    echo 仓库地址: https://github.com/%GITHUB_USER%/%REPO_NAME%
    pause
    exit /b 0
)

:manual
echo ========================================
echo   手动推送步骤
echo ========================================
echo.
echo 1. 打开 https://github.com/new
echo 2. 创建新仓库: %REPO_NAME%
echo 3. 不要勾选 "Add a README file"
echo 4. 点击 "Create repository"
echo 5. 创建完成后，按任意键继续...
pause >nul

echo.
echo 正在推送代码...
git branch -M main
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
git push -u origin main

echo.
echo ========================================
echo   完成！
echo ========================================
echo.
echo 仓库地址: https://github.com/%GITHUB_USER%/%REPO_NAME%
echo.
echo 后续更新代码只需:
echo   git add .
echo   git commit -m "更新说明"
echo   git push
echo.
pause
