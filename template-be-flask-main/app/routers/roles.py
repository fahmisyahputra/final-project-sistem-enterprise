from fastapi import APIRouter, Depends, Query
from typing import List
from neo4j import Session
from app.db.neo4j import get_db
from app.services.analytics import AnalyticsService
from app.models.schemas import RoleInteraction

router = APIRouter(
    prefix="/roles",
    tags=["Roles"]
)

@router.get("/interactions", response_model=List[RoleInteraction])
async def get_role_interactions(session: Session = Depends(get_db)):
    """
    Get all role interactions.
    """
    service = AnalyticsService(session)
    return service.get_role_interactions()

@router.get("/top-interactions", response_model=List[RoleInteraction])
async def get_top_interactions(
    limit: int = Query(10, description="Number of top interactions to return"),
    session: Session = Depends(get_db)
):
    """
    Get top N strongest role interactions.
    """
    service = AnalyticsService(session)
    return service.get_top_interactions(limit)

@router.get("/all", response_model=List[dict])
async def get_all_roles(session: Session = Depends(get_db)):
    """
    Get all existing roles.
    """
    service = AnalyticsService(session)
    return service.get_all_roles()
