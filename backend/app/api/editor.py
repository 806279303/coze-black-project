from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
import uuid
import aiofiles

from app.core.config import settings

router = APIRouter()

# ========== Models ==========

class FileItem(BaseModel):
    id: str
    name: str
    size: str
    type: str
    uploader: str
    uploader_id: str
    upload_time: str
    is_owner: bool

class Task(BaseModel):
    id: str
    title: str
    description: str
    status: str  # pending, in_progress, completed
    priority: str  # low, normal, high, urgent
    deadline: str
    assignee: str
    assignee_id: str
    created_at: str

class DailyReport(BaseModel):
    id: str
    user_id: str
    user_name: str
    date: str
    tasks_completed: int
    content: str
    issues: Optional[str] = None
    created_at: str

class CreateReportRequest(BaseModel):
    tasks_completed: int
    content: str
    issues: Optional[str] = None

class UpdateTaskRequest(BaseModel):
    status: Optional[str] = None

# ========== Mock Data (生产环境用数据库) ==========

mock_files = []
mock_tasks = [
    {
        "id": "1",
        "title": "直播切片-零食专场",
        "description": "截取高光片段，做成3个短视频",
        "status": "in_progress",
        "priority": "high",
        "deadline": "2026-04-18 18:00",
        "assignee": "剪辑师A",
        "assignee_id": "2",
        "created_at": "2026-04-17 10:00"
    }
]
mock_reports = []

# ========== File APIs ==========

@router.get("/files", response_model=List[FileItem])
async def get_files(user_id: str = "1"):
    """获取文件列表"""
    return [
        FileItem(
            id="1",
            name="直播切片-0418-01.mp4",
            size="45.2 MB",
            type="video",
            uploader="大V",
            uploader_id="1",
            upload_time="2026-04-18 10:30",
            is_owner=user_id == "1"
        ),
        FileItem(
            id="2",
            name="产品介绍-精华版.mp4",
            size="128 MB",
            type="video",
            uploader="剪辑师A",
            uploader_id="2",
            upload_time="2026-04-18 09:15",
            is_owner=user_id == "2"
        ),
    ]

@router.post("/files/upload")
async def upload_file(
    file: UploadFile = File(...),
    user_id: str = "1",
    user_name: str = "用户"
):
    """上传文件"""
    file_id = str(uuid.uuid4())[:8]
    ext = file.filename.split('.')[-1] if file.filename else 'bin'
    
    # 确定文件类型
    file_type = "other"
    if file.content_type:
        if file.content_type.startswith('video'):
            file_type = "video"
        elif file.content_type.startswith('image'):
            file_type = "image"
        elif file.content_type.startswith('audio'):
            file_type = "audio"
    
    # 保存文件
    file_path = f"{settings.UPLOAD_DIR}/editor/{file_id}.{ext}"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    file_size = os.path.getsize(file_path)
    size_str = f"{file_size / 1024 / 1024:.1f} MB" if file_size > 1024 * 1024 else f"{file_size / 1024:.1f} KB"
    
    return {
        "id": file_id,
        "name": file.filename,
        "size": size_str,
        "type": file_type,
        "uploader": user_name,
        "uploader_id": user_id,
        "upload_time": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "is_owner": True
    }

@router.delete("/files/{file_id}")
async def delete_file(file_id: str, user_id: str = "1"):
    """删除文件（只能删除自己上传的）"""
    # 查找文件
    for ext in ['mp4', 'mp3', 'png', 'jpg', 'jpeg', 'mov']:
        path = f"{settings.UPLOAD_DIR}/editor/{file_id}.{ext}"
        if os.path.exists(path):
            os.remove(path)
            return {"message": "删除成功"}
    
    raise HTTPException(status_code=404, detail="文件不存在")

# ========== Task APIs ==========

@router.get("/tasks", response_model=List[Task])
async def get_tasks(user_id: str = "1"):
    """获取任务列表"""
    # 根据用户角色返回不同任务
    # 剪辑师只看自己的，管理员看全部
    tasks = [
        Task(
            id="1",
            title="直播切片-零食专场",
            description="截取高光片段，做成3个短视频",
            status="in_progress",
            priority="high",
            deadline="2026-04-18 18:00",
            assignee="剪辑师A",
            assignee_id="2",
            created_at="2026-04-17 10:00"
        ),
        Task(
            id="2",
            title="产品介绍视频",
            description="制作新产品介绍视频，时长30-60秒",
            status="pending",
            priority="normal",
            deadline="2026-04-19 12:00",
            assignee="剪辑师A",
            assignee_id="2",
            created_at="2026-04-17 14:00"
        ),
        Task(
            id="3",
            title="历史素材整理",
            description="整理4月份所有直播素材，分类归档",
            status="completed",
            priority="low",
            deadline="2026-04-17 18:00",
            assignee="剪辑师A",
            assignee_id="2",
            created_at="2026-04-16 09:00"
        ),
    ]
    return tasks

@router.patch("/tasks/{task_id}")
async def update_task(task_id: str, request: UpdateTaskRequest):
    """更新任务状态"""
    return {"id": task_id, "status": request.status}

# ========== Report APIs ==========

@router.get("/reports", response_model=List[DailyReport])
async def get_reports(date: Optional[str] = None, user_id: str = "1"):
    """获取日报列表"""
    reports = [
        DailyReport(
            id="1",
            user_id="2",
            user_name="剪辑师A",
            date="2026-04-17",
            tasks_completed=5,
            content="完成了3个直播切片，整理了素材库",
            issues="素材文件较大，传输较慢",
            created_at="2026-04-17 18:30"
        )
    ]
    return reports

@router.post("/reports")
async def create_report(request: CreateReportRequest, user_id: str = "1", user_name: str = "用户"):
    """提交日报"""
    report_id = str(uuid.uuid4())[:8]
    return {
        "id": report_id,
        "user_id": user_id,
        "user_name": user_name,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "tasks_completed": request.tasks_completed,
        "content": request.content,
        "issues": request.issues,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
    }

# ========== Statistics ==========

@router.get("/stats")
async def get_stats(user_id: str = "1"):
    """获取统计数据"""
    return {
        "tasks_completed": 3,
        "files_processed": 12,
        "work_hours": 6.5,
        "pending_tasks": 2
    }
