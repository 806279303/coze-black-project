from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App
    APP_NAME: str = "直播运营系统"
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database
    DATABASE_URL: str = "sqlite:///./data.db"
    
    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    
    # APIs
    WAVESPEED_API_KEY: Optional[str] = None
    WAVESPEED_ENDPOINT: str = "https://api.wavespeed.ai/api/v3/wavespeed-ai/image-watermark-remover"
    
    BYTEDANCE_API_KEY: Optional[str] = None
    BYTEDANCE_ENDPOINT: str = "https://cv-api.bytedance.com/api/v1/watermark_removal"
    
    # Qianchuan API
    QIANCHUAN_APP_ID: Optional[str] = None
    QIANCHUAN_SECRET: Optional[str] = None
    QIANCHUAN_ACCESS_TOKEN: Optional[str] = None
    QIANCHUAN_REFRESH_TOKEN: Optional[str] = None
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }

settings = Settings()
