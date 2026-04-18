from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx
import random

from app.core.config import settings

router = APIRouter()

class GenerateRequest(BaseModel):
    product: str
    keywords: Optional[str] = None

class GeneratedContent(BaseModel):
    id: str
    title: str
    copy: str
    tags: List[str]
    hot_score: int

class GenerateResponse(BaseModel):
    results: List[GeneratedContent]

# 爆款文案模板
TITLE_TEMPLATES = [
    "{product}实测！我后悔没有早点发现",
    "{product}到底值不值得买？真实体验告诉你",
    "{product}让我从{keyword}变达人！",
    "火了！{product}为什么这么火？深度解析",
    "用了{product}一个月，我的变化太大了",
    "{product}测评｜花了几千块买来的教训",
    "全网都在推{product}，我替你们踩雷了",
    "后悔买晚了！{product}使用心得分享",
    "{product}真的有用吗？一个月实测报告",
    "不吹不黑！{product}真实体验+避坑指南",
]

COPY_TEMPLATES = [
    "姐妹们！这个{product}真的绝了！用了3天就看到效果，现在后悔没早点发现。分享给你们，不踩雷！#{keyword} #好物分享 #亲测有效",
    "全网都在推{product}，真的有那么好吗？我替你们试了半个月，说真话！优缺点都告诉你，看完再决定要不要买。#{product}测评 #真实体验",
    "一个月前我还是{keyword}小白，用了{product}之后，现在朋友都来问我！分享一下我的使用心得和小技巧～",
    "最近{product}刷爆朋友圈，到底是营销还是真的好？今天给大家深度分析，看完这篇你就懂了！",
    "说真话！{product}我用了{days}天，今天来交作业了！有惊喜也有槽点，想买的姐妹看完再决定～",
]

TAG_SETS = [
    ["实测分享", "好物推荐", "不踩雷"],
    ["真实测评", "避坑指南", "干货分享"],
    ["使用技巧", "干货分享", "新手必看"],
    ["深度解析", "行业揭秘", "知识分享"],
    ["好物分享", "生活记录", "种草"],
]

@router.post("/generate", response_model=GenerateResponse)
async def generate_titles(request: GenerateRequest):
    """生成爆款标题和文案"""
    
    if not request.product:
        raise HTTPException(status_code=400, detail="产品名称不能为空")
    
    keywords = request.keywords.split(",") if request.keywords else ["好物"]
    keyword = keywords[0].strip() or "好物"
    
    results = []
    used_templates = set()
    
    # 生成4-5个不同的结果
    for i in range(min(5, len(TITLE_TEMPLATES))):
        # 选择未使用的模板
        available_indices = [j for j in range(len(TITLE_TEMPLATES)) if j not in used_templates]
        if not available_indices:
            break
            
        template_idx = random.choice(available_indices)
        used_templates.add(template_idx)
        
        title = TITLE_TEMPLATES[template_idx].format(
            product=request.product,
            keyword=keyword
        )
        
        copy_idx = i % len(COPY_TEMPLATES)
        copy = COPY_TEMPLATES[copy_idx].format(
            product=request.product,
            keyword=keyword,
            days=random.randint(7, 30)
        )
        
        tags = TAG_SETS[i % len(TAG_SETS)]
        hot_score = random.randint(75, 99)
        
        results.append(GeneratedContent(
            id=str(i + 1),
            title=title,
            copy=copy,
            tags=tags,
            hot_score=hot_score,
        ))
    
    # 按热度排序
    results.sort(key=lambda x: x.hot_score, reverse=True)
    
    return GenerateResponse(results=results)

@router.get("/trending")
async def get_trending_keywords():
    """获取热门关键词（演示用）"""
    # 实际应该从抖音、小红书等平台爬取
    return {
        "keywords": [
            {"word": "美白", "heat": 98},
            {"word": "护肤", "heat": 95},
            {"word": "好物", "heat": 92},
            {"word": "测评", "heat": 88},
            {"word": "干货", "heat": 85},
        ]
    }
