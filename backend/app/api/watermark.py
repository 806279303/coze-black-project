from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import os
import uuid
import aiofiles
import httpx
import base64
import asyncio
from datetime import datetime

from app.core.config import settings

router = APIRouter()

# ========== 数据模型 ==========
class WatermarkResult(BaseModel):
    id: str
    original_name: str
    status: str  # processing, success, error
    preview_url: Optional[str] = None
    download_url: Optional[str] = None
    error: Optional[str] = None
    created_at: str = ""
    processed_at: Optional[str] = None

# ========== 存储处理结果 ==========
processing_results = {}

# ========== 常量配置 ==========
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
API_TIMEOUT = 60  # API 超时时间
MAX_POLL_ATTEMPTS = 30  # 最大轮询次数

# ========== 异步处理函数 ==========
async def process_watermark(file_id: str, file_path: str, original_name: str):
    """异步处理去水印任务"""
    start_time = datetime.now()
    
    try:
        # 检查是否配置了 API Key
        if not settings.WAVESPEED_API_KEY:
            processing_results[file_id] = WatermarkResult(
                id=file_id,
                original_name=original_name,
                status="error",
                error="未配置 WAVESPEED_API_KEY，请在 .env 文件中配置",
                created_at=start_time.isoformat(),
            )
            return

        # 读取图片并转换为 base64
        async with aiofiles.open(file_path, 'rb') as f:
            image_data = await f.read()
        
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # 检测图片格式
        ext = file_path.split('.')[-1].lower()
        mime_type = "image/jpeg"
        if ext == "png":
            mime_type = "image/png"
        elif ext == "webp":
            mime_type = "image/webp"
        
        # 调用 WaveSpeedAI API
        result_url = await call_wavespeed_api(
            image_base64=image_base64,
            mime_type=mime_type,
            file_id=file_id,
            original_name=original_name
        )
        
        if result_url:
            # 下载结果图片
            result_path = await download_result_image(result_url, file_id, ext)
            
            processing_results[file_id] = WatermarkResult(
                id=file_id,
                original_name=original_name,
                status="success",
                preview_url=f"/api/watermark/preview/{file_id}",
                download_url=f"/api/watermark/download/{file_id}",
                created_at=start_time.isoformat(),
                processed_at=datetime.now().isoformat(),
            )
        else:
            raise Exception("处理失败：无法获取结果图片")
            
    except httpx.TimeoutException:
        processing_results[file_id] = WatermarkResult(
            id=file_id,
            original_name=original_name,
            status="error",
            error="API 请求超时，请稍后重试",
            created_at=start_time.isoformat(),
        )
    except httpx.HTTPStatusError as e:
        error_msg = f"API 请求失败: {e.response.status_code}"
        try:
            error_detail = e.response.json()
            if "message" in error_detail:
                error_msg = error_detail["message"]
            elif "error" in error_detail:
                error_msg = error_detail["error"]
        except:
            pass
        processing_results[file_id] = WatermarkResult(
            id=file_id,
            original_name=original_name,
            status="error",
            error=error_msg,
            created_at=start_time.isoformat(),
        )
    except Exception as e:
        processing_results[file_id] = WatermarkResult(
            id=file_id,
            original_name=original_name,
            status="error",
            error=f"处理出错: {str(e)}",
            created_at=start_time.isoformat(),
        )

async def call_wavespeed_api(
    image_base64: str, 
    mime_type: str, 
    file_id: str,
    original_name: str
) -> Optional[str]:
    """调用 WaveSpeedAI API 处理图片"""
    
    headers = {
        "Authorization": f"Bearer {settings.WAVESPEED_API_KEY}",
        "Content-Type": "application/json",
    }
    
    # 方式一：使用同步模式（推荐，简单直接）
    payload = {
        "image": f"data:{mime_type};base64,{image_base64}",
        "output_format": "png",
        "enable_sync_mode": True,  # 同步等待结果
        "enable_base64_output": False,  # 返回 URL
    }
    
    try:
        async with httpx.AsyncClient(timeout=API_TIMEOUT) as client:
            # 提交任务
            response = await client.post(
                settings.WAVESPEED_ENDPOINT,
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            result = response.json()
            
            # 检查状态
            if result.get("code") == 200 and result.get("data", {}).get("status") == "completed":
                outputs = result.get("data", {}).get("outputs", [])
                if outputs:
                    return outputs[0]  # 返回图片 URL
            
            # 如果同步模式没有直接返回结果，尝试轮询
            task_id = result.get("data", {}).get("id")
            if task_id:
                return await poll_for_result(client, task_id, headers)
            
            return None
            
    except Exception as e:
        # 如果 base64 方式失败，记录日志并抛出异常
        print(f"WaveSpeedAI API 调用失败: {e}")
        raise

async def poll_for_result(
    client: httpx.AsyncClient, 
    task_id: str, 
    headers: dict
) -> Optional[str]:
    """轮询获取处理结果"""
    
    result_url = f"https://api.wavespeed.ai/api/v3/predictions/{task_id}/result"
    
    for attempt in range(MAX_POLL_ATTEMPTS):
        await asyncio.sleep(1)  # 等待 1 秒后查询
        
        try:
            response = await client.get(result_url, headers=headers)
            response.raise_for_status()
            result = response.json()
            
            status = result.get("data", {}).get("status")
            
            if status == "completed":
                outputs = result.get("data", {}).get("outputs", [])
                if outputs:
                    return outputs[0]
            elif status == "failed":
                error = result.get("data", {}).get("error", "处理失败")
                raise Exception(error)
                
        except Exception as e:
            if attempt == MAX_POLL_ATTEMPTS - 1:
                raise
            continue
    
    raise Exception("处理超时，请稍后重试")

async def download_result_image(url: str, file_id: str, ext: str) -> str:
    """下载结果图片到本地"""
    
    result_dir = f"{settings.UPLOAD_DIR}/results"
    os.makedirs(result_dir, exist_ok=True)
    
    result_path = f"{result_dir}/{file_id}.{ext}"
    
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(url)
        response.raise_for_status()
        
        async with aiofiles.open(result_path, 'wb') as f:
            await f.write(response.content)
    
    return result_path

# ========== API 路由 ==========
@router.post("/upload", response_model=WatermarkResult)
async def upload_image(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """上传图片并处理去水印"""
    
    # 1. 验证文件类型
    if not file.content_type or file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400, 
            detail=f"不支持的文件类型，仅支持: {', '.join(ALLOWED_TYPES)}"
        )
    
    # 2. 读取文件内容检查大小
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, 
            detail=f"文件过大，最大支持 {MAX_FILE_SIZE // 1024 // 1024}MB"
        )
    
    # 3. 生成唯一 ID
    file_id = str(uuid.uuid4())[:8]
    
    # 4. 保存上传文件
    ext = file.filename.split('.')[-1] if file.filename and '.' in file.filename else 'jpg'
    ext = ext.lower()
    if ext not in ['jpg', 'jpeg', 'png', 'webp']:
        ext = 'jpg'
    
    upload_dir = settings.UPLOAD_DIR
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = f"{upload_dir}/{file_id}.{ext}"
    
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(content)
    
    # 5. 初始化处理状态
    processing_results[file_id] = WatermarkResult(
        id=file_id,
        original_name=file.filename or "unknown",
        status="processing",
        created_at=datetime.now().isoformat(),
    )
    
    # 6. 添加后台任务
    background_tasks.add_task(
        process_watermark, 
        file_id, 
        file_path, 
        file.filename or "unknown"
    )
    
    return processing_results[file_id]

@router.get("/status/{file_id}", response_model=WatermarkResult)
async def get_status(file_id: str):
    """获取处理状态"""
    if file_id not in processing_results:
        raise HTTPException(status_code=404, detail="任务不存在")
    return processing_results[file_id]

@router.get("/preview/{file_id}")
async def get_preview(file_id: str):
    """获取预览图"""
    from fastapi.responses import FileResponse
    
    # 优先返回处理后的图片
    for ext in ['png', 'jpg', 'jpeg', 'webp']:
        path = f"{settings.UPLOAD_DIR}/results/{file_id}.{ext}"
        if os.path.exists(path):
            return FileResponse(path, media_type=f"image/{ext}")
    
    # 如果没有处理结果，返回原图
    for ext in ['jpg', 'jpeg', 'png', 'webp']:
        path = f"{settings.UPLOAD_DIR}/{file_id}.{ext}"
        if os.path.exists(path):
            return FileResponse(path, media_type=f"image/{ext}")
    
    raise HTTPException(status_code=404, detail="预览图不存在")

@router.get("/download/{file_id}")
async def download_file(file_id: str):
    """下载处理后的图片"""
    from fastapi.responses import FileResponse
    
    for ext in ['png', 'jpg', 'jpeg', 'webp']:
        path = f"{settings.UPLOAD_DIR}/results/{file_id}.{ext}"
        if os.path.exists(path):
            return FileResponse(
                path, 
                filename=f"cleaned_{file_id}.{ext}",
                media_type=f"image/{ext}"
            )
    
    raise HTTPException(status_code=404, detail="文件不存在，可能还在处理中或处理失败")

@router.delete("/{file_id}")
async def delete_file(file_id: str):
    """删除文件和结果"""
    deleted = False
    
    # 删除原图
    for ext in ['jpg', 'jpeg', 'png', 'webp']:
        path = f"{settings.UPLOAD_DIR}/{file_id}.{ext}"
        if os.path.exists(path):
            os.remove(path)
            deleted = True
    
    # 删除结果图
    for ext in ['jpg', 'jpeg', 'png', 'webp']:
        path = f"{settings.UPLOAD_DIR}/results/{file_id}.{ext}"
        if os.path.exists(path):
            os.remove(path)
            deleted = True
    
    # 删除记录
    if file_id in processing_results:
        del processing_results[file_id]
        deleted = True
    
    if not deleted:
        raise HTTPException(status_code=404, detail="文件不存在")
    
    return {"message": "删除成功"}
