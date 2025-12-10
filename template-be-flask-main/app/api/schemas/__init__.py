"""
Schemas Package
===============
DTOs (Data Transfer Objects) & Validation

Menggunakan Marshmallow untuk:
- Request validation
- Response serialization
- Data transformation

Memisahkan representasi API dari domain model.
"""

from app.api.schemas.student_schema import (
    StudentSchema,
    StudentCreateSchema,
    StudentUpdateSchema,
    PredictionRequestSchema,
    PredictionResponseSchema
)

__all__ = [
    'StudentSchema',
    'StudentCreateSchema',
    'StudentUpdateSchema',
    'PredictionRequestSchema',
    'PredictionResponseSchema'
]
