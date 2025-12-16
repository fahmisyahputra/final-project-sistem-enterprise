from fastapi import APIRouter, Depends, Query
from typing import List
from neo4j import Session
from app.db.neo4j import get_db
from app.services.analytics import AnalyticsService
from app.services.importer import DataImporter
import os
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
    year: str = Query(None, description="Year to filter (YYYY). If omitted, returns all time."),
    session: Session = Depends(get_db)
):
    """
    Get total interactions per month.
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

@router.get("/project-durations/average", response_model=float)
async def get_average_project_duration(
    session: Session = Depends(get_db)
):
    """
    Get the average duration of all projects.
    """
    service = AnalyticsService(session)
    return service.get_average_project_duration()

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

@router.post("/load-data")
async def load_data(session: Session = Depends(get_db)):
    """
    Reset database and load data from CSV files in data-analysis folder.
    """
    importer = DataImporter(session)
    
    # Path to data-analysis folder (relative to backend root)
    # Path to data-analysis folder (relative to backend root)
    # __file__ is app/routers/organization.py
    # 1. app/routers
    # 2. app
    # 3. template-be-flask-main
    # 4. sisen-iimlab (Project Root)
    
    current_file = os.path.abspath(__file__)
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(current_file))))
    data_dir = os.path.join(project_root, "data-analysis")
    
    print(f"DEBUG: Loading data from: {data_dir}")
    
    files = [
        "Agile Event Log.csv",
        "Similar Agile Event Log.csv",
        "Uncomplete Agile Event Log.csv"
    ]
    
    try:
        importer.clear_database()
        total_rows = 0
        loaded_files = []
        
        for filename in files:
            file_path = os.path.join(data_dir, filename)
            if os.path.exists(file_path):
                rows = importer.load_csv(file_path)
                total_rows += rows
                loaded_files.append(filename)
        
        importer.project_graph()
        
        return {
            "success": True,
            "message": f"Successfully loaded {total_rows} rows from {len(loaded_files)} files.",
            "files": loaded_files
        }
    except Exception as e:
        return {"success": False, "message": str(e)}
