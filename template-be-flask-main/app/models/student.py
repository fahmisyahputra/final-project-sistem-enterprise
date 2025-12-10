"""
Student Model
=============
Domain entity untuk Student

Model ini adalah representasi murni dari domain object,
tidak terikat dengan database atau framework tertentu.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Student:
    """
    Student Domain Entity

    Attributes:
        id: Unique identifier
        name: Student name
        email: Student email
        study_hours: Weekly study hours
        attendance_rate: Attendance percentage (0-100)
        gpa: Grade Point Average (calculated or actual)
        created_at: Creation timestamp
        updated_at: Last update timestamp
    """

    name: str
    email: str
    study_hours: float
    attendance_rate: float
    id: Optional[int] = None
    gpa: Optional[float] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __post_init__(self):
        """Initialize timestamps if not provided"""
        if self.created_at is None:
            self.created_at = datetime.utcnow()
        if self.updated_at is None:
            self.updated_at = datetime.utcnow()

    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'study_hours': self.study_hours,
            'attendance_rate': self.attendance_rate,
            'gpa': self.gpa,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Student':
        """Create Student from dictionary"""
        return cls(
            id=data.get('id'),
            name=data['name'],
            email=data['email'],
            study_hours=data['study_hours'],
            attendance_rate=data['attendance_rate'],
            gpa=data.get('gpa'),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )
