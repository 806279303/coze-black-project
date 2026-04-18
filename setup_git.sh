#!/bin/bash

echo "========================================"
echo "  直播运营系统 - Git 仓库初始化"
echo "========================================"
echo

# 检查 git
if ! command -v git &> /dev/null; then
    echo "[错误] 未检测到 Git，请先安装 Git"
    exit 1
fi

# 检查 gh
HAS_GH=true
if ! command -v gh &> /dev/null; then
    echo "[提示] 未检测到 GitHub CLI (gh)，将使用手动方式"
    HAS_GH=false
fi

echo
read -p "请输入您的 GitHub 用户名: " GITHUB_USER
echo
read -p "请输入仓库名称 (默认: live-ops-system): " REPO_NAME
REPO_NAME=${REPO_NAME:-live-ops-system}

echo
echo "正在初始化 Git 仓库..."

git init
git add .
git commit -m "初始化项目: 直播运营系统 v1.3.0"

echo
echo "Git 仓库初始化完成！"
echo

if [ "$HAS_GH" = true ]; then
    read -p "检测到 GitHub CLI，是否自动创建仓库并推送？ [Y/n]: " AUTO_PUSH
    AUTO_PUSH=${AUTO_PUSH:-Y}
    
    if [ "${AUTO_PUSH^^}" != "N" ]; then
        echo
        echo "正在创建 GitHub 仓库并推送..."
        gh repo create "$REPO_NAME" --public --source=. --push
        
        echo
        echo "========================================"
        echo "  完成！仓库已创建并推送"
        echo "========================================"
        echo
        echo "仓库地址: https://github.com/$GITHUB_USER/$REPO_NAME"
        exit 0
    fi
fi

echo "========================================"
echo "  手动推送步骤"
echo "========================================"
echo
echo "1. 打开 https://github.com/new"
echo "2. 创建新仓库: $REPO_NAME"
echo "3. 不要勾选 'Add a README file'"
echo "4. 点击 'Create repository'"
echo "5. 创建完成后，按回车继续..."
read

echo
echo "正在推送代码..."
git branch -M main
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
git push -u origin main

echo
echo "========================================"
echo "  完成！"
echo "========================================"
echo
echo "仓库地址: https://github.com/$GITHUB_USER/$REPO_NAME"
echo
echo "后续更新代码只需:"
echo "  git add ."
echo "  git commit -m '更新说明'"
echo "  git push"
echo
