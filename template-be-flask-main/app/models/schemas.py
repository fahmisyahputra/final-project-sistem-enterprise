from pydantic import BaseModel, Field
from typing import List, Optional

class OrganizationEvolution(BaseModel):
    phase: str
    active_users: int
    active_roles: int
    total_interactions: int
    top_roles: List[str]

class RoleInteraction(BaseModel):
    role_a: str
    role_b: str
    weight: int

class UserCollaboration(BaseModel):
    user_a: str
    role_a: str
    user_b: str
    role_b: str
    weight: int
    month: str

class BPMNData(BaseModel):
    nodes: List[dict]
    edges: List[dict]

class MonthlyInteraction(BaseModel):
    month: str
    total_interactions: int

class Role(BaseModel):
    name: str

class User(BaseModel):
    name: str

class OvertimeRisk(BaseModel):
    name: str
    role: str
    overtime_count: int

class ProjectDuration(BaseModel):
    case_id: str
    duration_days: int

class HandoverFlow(BaseModel):
    source_role: str
    target_role: str
    avg_duration: float

class UtilizationMetric(BaseModel):
    day: int
    hour: int
    count: int
