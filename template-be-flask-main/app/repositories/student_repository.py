"""
Student Repository
==================
Data Access Layer untuk Student entity

Implementasi menggunakan in-memory storage untuk kesederhanaan.
Dalam aplikasi production, bisa diganti dengan:
- SQLAlchemy (PostgreSQL, MySQL, SQLite)
- MongoDB
- Redis
- dll

Tanpa perlu mengubah service layer atau layer di atasnya.
"""

from typing import List, Optional
from datetime import datetime
from app.models.student import Student


class StudentRepository:
    """
    Repository untuk mengelola persistence Student entity

    Pattern ini memisahkan business logic dari detail storage,
    membuat code lebih testable dan maintainable.
    """

    def __init__(self):
        """Initialize in-memory storage"""
        self._storage: dict[int, Student] = {}
        self._current_id = 1

    def create(self, student: Student) -> Student:
        """
        Create new student

        Args:
            student: Student object (without id)

        Returns:
            Student object with generated id
        """
        student.id = self._current_id
        student.created_at = datetime.utcnow()
        student.updated_at = datetime.utcnow()
        self._storage[self._current_id] = student
        self._current_id += 1
        return student

    def find_by_id(self, student_id: int) -> Optional[Student]:
        """
        Find student by id

        Args:
            student_id: Student ID

        Returns:
            Student object if found, None otherwise
        """
        return self._storage.get(student_id)

    def find_all(self) -> List[Student]:
        """
        Get all students

        Returns:
            List of all students
        """
        return list(self._storage.values())

    def find_by_email(self, email: str) -> Optional[Student]:
        """
        Find student by email

        Args:
            email: Student email

        Returns:
            Student object if found, None otherwise
        """
        for student in self._storage.values():
            if student.email == email:
                return student
        return None

    def update(self, student_id: int, student: Student) -> Optional[Student]:
        """
        Update existing student

        Args:
            student_id: Student ID to update
            student: Student object with updated data

        Returns:
            Updated Student object if found, None otherwise
        """
        if student_id not in self._storage:
            return None

        student.id = student_id
        student.updated_at = datetime.utcnow()
        # Preserve created_at from original
        student.created_at = self._storage[student_id].created_at
        self._storage[student_id] = student
        return student

    def delete(self, student_id: int) -> bool:
        """
        Delete student by id

        Args:
            student_id: Student ID to delete

        Returns:
            True if deleted, False if not found
        """
        if student_id in self._storage:
            del self._storage[student_id]
            return True
        return False

    def count(self) -> int:
        """
        Get total number of students

        Returns:
            Total count
        """
        return len(self._storage)


# Singleton instance untuk in-memory storage
# Dalam production dengan database, ini bisa diinject melalui dependency injection
student_repository = StudentRepository()
