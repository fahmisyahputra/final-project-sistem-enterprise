from fastapi import APIRouter, Depends, Query
from typing import List
from neo4j import Session
from app.db.neo4j import get_db
from app.services.analytics import AnalyticsService
from app.models.schemas import UserCollaboration

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/collaboration", response_model=List[UserCollaboration])
async def get_user_collaboration(
    month: str = Query(..., description="Month to filter (YYYY-MM)"),
    session: Session = Depends(get_db)
):
    """
    Get user collaboration for a specific month.
    """
    service = AnalyticsService(session)
    return service.get_user_collaboration(month)

@router.get("/all", response_model=List[dict])
async def get_all_users(session: Session = Depends(get_db)):
    """
    Get all existing users.
    """
    service = AnalyticsService(session)
    return service.get_all_users()
