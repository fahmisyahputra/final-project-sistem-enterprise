from fastapi import APIRouter, Depends, Query
from typing import List
from neo4j import Session
from app.db.neo4j import get_db
from app.services.analytics import AnalyticsService
from app.models.schemas import OrganizationEvolution

router = APIRouter(
    prefix="/organization",
    tags=["Organization"]
)

@router.get("/evolution", response_model=OrganizationEvolution)
async def get_organization_evolution(
    start_month: str = Query(..., description="Start month (YYYY-MM)"),
    end_month: str = Query(..., description="End month (YYYY-MM)"),
    session: Session = Depends(get_db)
):
    """
    Get organization evolution statistics for a given period.
    """
    service = AnalyticsService(session)
    return service.get_organization_evolution(start_month, end_month)

@router.get("/evolution-trend", response_model=List[OrganizationEvolution])
async def get_organization_evolution_trend(
    start_month: str = Query(..., description="Start month (YYYY-MM)"),
    end_month: str = Query(..., description="End month (YYYY-MM)"),
    session: Session = Depends(get_db)
):
    """
    Get organization evolution trend (monthly) for a given period.
    """
    service = AnalyticsService(session)
    return service.get_organization_evolution_trend(start_month, end_month)

@router.get("/interactions-trend", response_model=List[dict]) # Using dict for simplicity, or import MonthlyInteraction
async def get_interactions_trend(
    year: str = Query(..., description="Year to filter (YYYY)"),
    session: Session = Depends(get_db)
):
    """
    Get total interactions per month for a given year.
    """
    service = AnalyticsService(session)
    return service.get_monthly_interactions(year)

@router.get("/overtime", response_model=List[dict]) # Should use OvertimeRisk schema
async def get_overtime_risk(
    session: Session = Depends(get_db)
):
    """
    Identify employees working outside standard business hours (Top 5).
    """
    service = AnalyticsService(session)
    return service.get_overtime_risk()

@router.get("/project-durations", response_model=List[dict]) # Should use ProjectDuration schema
async def get_project_durations(
    session: Session = Depends(get_db)
):
    """
    Calculate the lifecycle duration of each Case (Top 10 Longest).
    """
    service = AnalyticsService(session)
    return service.get_project_durations()

@router.get("/handovers", response_model=List[dict]) # Should use HandoverFlow schema
async def get_handover_flow(
    session: Session = Depends(get_db)
):
    """
    Visualize the 'chain of command' or workflow efficiency.
    """
    service = AnalyticsService(session)
    return service.get_handover_flow()

@router.get("/utilization", response_model=List[dict]) # Should use UtilizationMetric schema
async def get_resource_utilization(
    session: Session = Depends(get_db)
):
    """
    Identify burnout risks and peak operational hours.
    """
    service = AnalyticsService(session)
    return service.get_resource_utilization()
