# 直播运营系统

一套面向电商直播团队的内部管理系统，采用极简玻璃拟态设计风格。

## 版本信息

- **当前版本**: v1.4.0
- **更新日期**: 2026-04-19
- **变更内容**: 实现真正的 WaveSpeedAI 去水印 API 对接

## 功能模块

- ✅ **智能去水印** - 基于 WaveSpeedAI API，真正去除图片水印
- ✅ **爆款文案生成** - 自动搜索热门内容，生成带货标题和文案
- ✅ **剪辑师工作台** - 文件管理、日报、任务分配
- ✅ **主播考勤** - 打卡、排班、统计
- ✅ **投流数据看板** - ROI、GMV、投流花费

## 技术栈

- **前端**: React 18 + TypeScript + TailwindCSS + Framer Motion
- **后端**: Python FastAPI
- **UI风格**: 玻璃拟态 + 暗色主题

## 快速开始

### 环境要求

- Node.js 18+
- Python 3.12+ (推荐 3.12，暂不支持 3.14)
- Git

### 一键启动（推荐）

**Windows:**
```bash
# 拉取最新代码
git pull

# 双击运行或执行：
reinstall_and_start.bat
```

**Mac/Linux:**
```bash
# 拉取最新代码
git pull

# 执行：
chmod +x reinstall_and_start.sh && ./reinstall_and_start.sh
```

脚本会自动：
1. 创建 Python 虚拟环境
2. 安装后端依赖
3. 安装前端依赖
4. 启动后端服务 (端口 8000)
5. 启动前端服务 (端口 3000)

### 访问地址

| 服务 | 地址 |
|------|------|
| 前端页面 | http://localhost:3000 |
| 后端 API | http://localhost:8000 |
| API 文档 | http://localhost:8000/docs |

### 手动启动（备用）

**前端启动:**
```bash
cd frontend
npm install
npm run dev
```

**后端启动:**
```bash
cd backend
py -3.12 -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
copy .env.example .env         # Windows
# cp .env.example .env         # Mac/Linux

# 编辑 .env 配置 API Key 后启动
python -m uvicorn app.main:app --reload --port 8000
```

## 智能去水印功能

### 配置 WaveSpeedAI API

1. **注册账号**
   - 访问 https://wavespeed.ai
   - 点击 Sign Up 注册
   - 进入 Dashboard → API Keys

2. **获取 API Key**
   - 点击 Create API Key
   - 复制生成的密钥

3. **配置到项目**
   ```bash
   # 编辑 backend/.env 文件
   WAVESPEED_API_KEY=你刚才复制的API_Key
   ```

### 使用说明

- **支持格式**: JPEG, PNG, WEBP
- **文件大小**: 最大 10MB
- **处理时间**: 约 2-5 秒
- **费用**: 约 $0.012-0.015/次

### API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/watermark/upload` | POST | 上传图片处理去水印 |
| `/api/watermark/status/{id}` | GET | 查询处理状态 |
| `/api/watermark/preview/{id}` | GET | 获取预览图 |
| `/api/watermark/download/{id}` | GET | 下载处理后的图片 |
| `/api/watermark/{id}` | DELETE | 删除文件 |

### 常见问题

**Q: 提示"未配置 WAVESPEED_API_KEY"**
- 确保 `.env` 文件存在于 `backend/` 目录
- 确保 API Key 正确无误
- 重启后端服务使配置生效

**Q: 处理一直显示 "processing"**
- 检查后端控制台日志
- 确认网络连接正常
- WaveSpeedAI 服务可能暂时不可用

**Q: API 调用失败**
- 检查 API Key 是否有效
- 确认账户余额充足
- 检查图片格式和大小是否符合要求

## 项目结构

```
直播运营系统/
├── frontend/           # React前端
│   ├── src/
│   │   ├── components/ # 通用组件
│   │   ├── pages/      # 页面
│   │   ├── stores/     # 状态管理
│   │   └── styles/     # 样式
│   └── package.json
│
├── backend/            # FastAPI后端
│   ├── app/
│   │   ├── api/        # API路由
│   │   ├── core/       # 核心配置
│   │   └── main.py     # 入口文件
│   ├── uploads/        # 上传文件目录
│   ├── .env.example    # 环境变量示例
│   └── requirements.txt
│
├── reinstall_and_start.bat  # Windows 一键重装启动
├── reinstall_and_start.sh   # Mac/Linux 一键重装启动
├── start.bat           # 快速启动（不重装依赖）
├── start.sh
└── README.md
```

## Git 管理

### 仓库地址

```
https://github.com/806279303/coze-black-project.git
```

### 拉取更新

```bash
git pull
```

### 更新后重启

```bash
# Windows
reinstall_and_start.bat

# Mac/Linux
./reinstall_and_start.sh
```

## 开发进度

- [x] 登录页面（动态粒子背景）
- [x] 主框架布局
- [x] AI工具箱首页
- [x] 智能去水印（WaveSpeedAI API 对接）
- [x] 爆款文案生成
- [x] 剪辑师工作台
- [x] 主播考勤
- [x] 投流数据看板
- [ ] 千川API对接
- [ ] 人员管理
- [ ] 文件共享中心

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.4.3 | 2026-04-19 | start.bat 改英文，reinstall_and_start 成功时显示醒目 SUCCESS 提示 |
| v1.4.2 | 2026-04-19 | 修复 Windows 编码问题，脚本改英文，去掉 requirements.txt 中文注释 |
| v1.4.0 | 2026-04-19 | 实现 WaveSpeedAI 去水印 API 真正对接，完善错误处理，添加一键重装启动脚本 |
| v1.3.0 | 2026-04-19 | 适配 Python 3.14（后改为推荐 3.12） |
| v1.2.0 | 2026-04-18 | 完成所有核心模块开发 |
| v1.0.0 | 2026-04-18 | 项目初始化 |

---

Made with ❤️ by 小v
