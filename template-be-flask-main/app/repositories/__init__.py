"""
Repositories Package
====================
Data Access Layer (DAL)

Repository pattern untuk abstraksi data access.
Memisahkan business logic dari detail persistence.

Bisa diganti dengan SQLAlchemy, MongoDB, atau data source lainnya
tanpa mengubah business logic layer.
"""

from app.repositories.student_repository import StudentRepository

__all__ = ['StudentRepository']
