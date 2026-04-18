from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """用户登录"""
    # 简化版：实际应该查询数据库验证
    # 这里演示用，任何非空用户名密码都可以登录
    
    if not request.username or not request.password:
        raise HTTPException(status_code=400, detail="用户名和密码不能为空")
    
    # 创建 token
    access_token = create_access_token(
        data={"sub": request.username, "role": "admin"}
    )
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": "1",
            "username": request.username,
            "role": "admin",
            "realName": "大V" if request.username == "admin" else request.username,
        }
    )

@router.post("/logout")
async def logout():
    """用户登出"""
    return {"message": "登出成功"}
