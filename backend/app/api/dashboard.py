from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import random

router = APIRouter()

# ========== Models ==========

class MetricCard(BaseModel):
    label: str
    value: str
    change: float
    change_label: str

class DailyData(BaseModel):
    date: str
    roi: float
    gmv: int
    cost: int

class AdPlan(BaseModel):
    time: str
    name: str
    cost: int
    gmv: int
    roi: float
    status: str

class AttendanceRecord(BaseModel):
    id: str
    user_id: str
    user_name: str
    date: str
    check_in: Optional[str]
    check_out: Optional[str]
    status: str  # normal, late, early_leave, absent
    note: Optional[str]

class Schedule(BaseModel):
    id: str
    user_id: str
    user_name: str
    date: str
    shift_type: str  # morning, afternoon, evening, full
    start_time: str
    end_time: str
    note: Optional[str]

class AttendanceStats(BaseModel):
    user_name: str
    total_days: int
    present_days: int
    late_days: int
    early_leave_days: int
    absent_days: int
    attendance_rate: float

# ========== Dashboard APIs ==========

@router.get("/metrics")
async def get_metrics(time_range: str = "today"):
    """获取核心指标"""
    return {
        "roi": {"value": 3.25, "change": 8.2},
        "gmv": {"value": 128560, "change": 12.5},
        "cost": {"value": 39540, "change": -5.3},
        "orders": {"value": 89, "change": 15.2},
    }

@router.get("/trend", response_model=List[DailyData])
async def get_trend(days: int = Query(7, ge=1, le=30)):
    """获取趋势数据"""
    data = []
    base_gmv = 85000
    base_cost = 28000
    
    for i in range(days):
        date = (datetime.now() - timedelta(days=days - i - 1)).strftime("%m-%d")
        gmv = base_gmv + random.randint(-10000, 25000)
        cost = base_cost + random.randint(-3000, 5000)
        roi = round(gmv / cost, 2)
        
        data.append(DailyData(
            date=date,
            roi=roi,
            gmv=gmv,
            cost=cost
        ))
    
    return data

@router.get("/plans", response_model=List[AdPlan])
async def get_ad_plans(date: Optional[str] = None):
    """获取投放计划明细"""
    return [
        AdPlan(time="08:00", name="零食专场-主推款", cost=8500, gmv=28500, roi=3.35, status="投放中"),
        AdPlan(time="10:00", name="零食专场-爆款引流", cost=12300, gmv=41200, roi=3.35, status="投放中"),
        AdPlan(time="14:00", name="零食专场-下午场", cost=9200, gmv=29440, roi=3.20, status="投放中"),
        AdPlan(time="18:00", name="零食专场-晚高峰", cost=9540, gmv=29420, roi=3.08, status="投放中"),
    ]

# ========== Attendance APIs ==========

@router.get("/attendance", response_model=List[AttendanceRecord])
async def get_attendance(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    user_id: Optional[str] = None
):
    """获取考勤记录"""
    return [
        AttendanceRecord(id="1", user_id="1", user_name="主播A", date="2026-04-18", 
                        check_in="07:55", check_out="15:30", status="normal"),
        AttendanceRecord(id="2", user_id="2", user_name="主播B", date="2026-04-18", 
                        check_in="08:10", check_out="16:00", status="late"),
        AttendanceRecord(id="3", user_id="3", user_name="主播C", date="2026-04-18", 
                        check_in="07:50", check_out="15:00", status="early_leave"),
        AttendanceRecord(id="4", user_id="4", user_name="主播D", date="2026-04-18", 
                        check_in=None, check_out=None, status="absent"),
    ]

@router.post("/attendance")
async def create_attendance(record: dict):
    """录入考勤"""
    return {
        "id": str(random.randint(1000, 9999)),
        **record,
        "created_at": datetime.now().isoformat()
    }

@router.put("/attendance/{record_id}")
async def update_attendance(record_id: str, record: dict):
    """更新考勤"""
    return {"id": record_id, **record}

@router.get("/schedules", response_model=List[Schedule])
async def get_schedules(
    year: int = Query(datetime.now().year),
    month: int = Query(datetime.now().month)
):
    """获取排班"""
    return [
        Schedule(id="1", user_id="1", user_name="主播A", date="2026-04-18", 
                shift_type="morning", start_time="08:00", end_time="16:00"),
        Schedule(id="2", user_id="2", user_name="主播B", date="2026-04-18", 
                shift_type="afternoon", start_time="14:00", end_time="22:00"),
        Schedule(id="3", user_id="3", user_name="主播C", date="2026-04-18", 
                shift_type="evening", start_time="18:00", end_time="23:00"),
        Schedule(id="4", user_id="4", user_name="主播D", date="2026-04-19", 
                shift_type="full", start_time="08:00", end_time="23:00"),
    ]

@router.post("/schedules")
async def create_schedule(schedule: dict):
    """创建排班"""
    return {
        "id": str(random.randint(1000, 9999)),
        **schedule,
        "created_at": datetime.now().isoformat()
    }

@router.get("/attendance/stats", response_model=List[AttendanceStats])
async def get_attendance_stats(
    year: int = Query(datetime.now().year),
    month: int = Query(datetime.now().month)
):
    """获取考勤统计"""
    return [
        AttendanceStats(user_name="主播A", total_days=22, present_days=21, 
                       late_days=1, early_leave_days=0, absent_days=1, attendance_rate=95.5),
        AttendanceStats(user_name="主播B", total_days=22, present_days=20, 
                       late_days=3, early_leave_days=1, absent_days=2, attendance_rate=90.9),
        AttendanceStats(user_name="主播C", total_days=22, present_days=22, 
                       late_days=0, early_leave_days=2, absent_days=0, attendance_rate=100.0),
        AttendanceStats(user_name="主播D", total_days=22, present_days=19, 
                       late_days=2, early_leave_days=0, absent_days=3, attendance_rate=86.4),
    ]

@router.get("/attendance/summary")
async def get_attendance_summary():
    """获取考勤总览"""
    return {
        "attendance_rate": 94.2,
        "late_count": 6,
        "early_leave_count": 3,
        "absent_count": 2
    }
