"""
Services Package
================
Business Logic Layer (BLL)

Service layer mengandung business logic aplikasi.
Koordinasi antara repository, external services, dan business rules.

Layer ini independen dari detail HTTP/REST API.
"""

from app.services.student_service import StudentService

__all__ = ['StudentService']
