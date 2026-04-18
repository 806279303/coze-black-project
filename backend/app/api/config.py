"""
API配置状态查询接口
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv

router = APIRouter()

# 加载环境变量
load_dotenv()


class ConfigStatus(BaseModel):
    """单个配置项状态"""
    key: str
    name: str
    description: str
    is_configured: bool
    required_for: List[str]


class ConfigStatusResponse(BaseModel):
    """配置状态响应"""
    configs: Dict[str, ConfigStatus]
    all_configured: bool


@router.get("/config/status", response_model=ConfigStatusResponse)
async def get_config_status():
    """
    获取所有API配置状态
    返回各个外部API是否已配置
    """
    
    # 定义需要检查的配置项
    config_items = {
        # WaveSpeed AI 去水印
        "wavespeed": ConfigStatus(
            key="WAVESPEED_API_KEY",
            name="WaveSpeed AI",
            description="去水印功能所需的API密钥",
            is_configured=bool(os.getenv("WAVESPEED_API_KEY")),
            required_for=["视频去水印", "视频解析"]
        ),
        
        # 巨量千川
        "qianchuan": ConfigStatus(
            key="QIANCHUAN_APP_ID",
            name="巨量千川",
            description="投流数据接口配置",
            is_configured=bool(os.getenv("QIANCHUAN_APP_ID")),
            required_for=["投流数据分析", "ROI计算"]
        ),
        
        # OpenAI
        "openai": ConfigStatus(
            key="OPENAI_API_KEY",
            name="OpenAI",
            description="AI标题生成等功能",
            is_configured=bool(os.getenv("OPENAI_API_KEY")),
            required_for=["标题生成", "AI助手"]
        ),
        
        # 抖音Cookie
        "douyin": ConfigStatus(
            key="DOUYIN_COOKIE",
            name="抖音Cookie",
            description="抖音视频解析所需",
            is_configured=bool(os.getenv("DOUYIN_COOKIE")),
            required_for=["抖音视频解析"]
        ),
    }
    
    # 检查是否全部配置
    all_configured = all(c.is_configured for c in config_items.values())
    
    return ConfigStatusResponse(
        configs=config_items,
        all_configured=all_configured
    )


@router.get("/config/{config_key}")
async def get_single_config_status(config_key: str):
    """
    获取单个配置项状态
    """
    # 配置项映射
    config_map = {
        "wavespeed": ("WAVESPEED_API_KEY", "WaveSpeed AI", "去水印功能所需的API密钥", ["视频去水印", "视频解析"]),
        "qianchuan": ("QIANCHUAN_APP_ID", "巨量千川", "投流数据接口配置", ["投流数据分析", "ROI计算"]),
        "openai": ("OPENAI_API_KEY", "OpenAI", "AI标题生成等功能", ["标题生成", "AI助手"]),
        "douyin": ("DOUYIN_COOKIE", "抖音Cookie", "抖音视频解析所需", ["抖音视频解析"]),
    }
    
    if config_key not in config_map:
        return {"error": f"Unknown config key: {config_key}"}
    
    key, name, desc, required = config_map[config_key]
    
    return ConfigStatus(
        key=key,
        name=name,
        description=desc,
        is_configured=bool(os.getenv(key)),
        required_for=required
    )
