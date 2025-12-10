from fastapi import APIRouter, Depends
from neo4j import Session
from app.db.neo4j import get_db
from app.services.analytics import AnalyticsService
from app.models.schemas import BPMNData

router = APIRouter(
    prefix="/bpmn",
    tags=["BPMN"]
)

@router.get("/data", response_model=BPMNData)
async def get_bpmn_data(session: Session = Depends(get_db)):
    """
    Get data structured for BPMN conversion.
    """
    service = AnalyticsService(session)
    return service.get_bpmn_data()
