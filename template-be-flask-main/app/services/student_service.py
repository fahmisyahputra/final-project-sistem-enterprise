"""
Student Service
===============
Business Logic Layer untuk Student domain

Service layer berisi:
- Business rules & validations
- Orchestration logic
- Coordination antara repositories dan external services
- Transaction management (jika ada)

Tidak ada detail HTTP/REST di layer ini.
"""

from typing import List, Optional, Dict, Any
from app.models.student import Student
from app.repositories.student_repository import student_repository


class StudentService:
    """
    Service untuk business logic Student

    Prinsip:
    - Single Responsibility: Hanya handle business logic Student
    - Dependency Injection: Repository di-inject (bisa dimock untuk testing)
    - Business Rules: Validasi domain-specific
    """

    def __init__(self, repository=None):
        """
        Initialize service

        Args:
            repository: StudentRepository instance (default: singleton)
        """
        self.repository = repository or student_repository

    def create_student(self, data: Dict[str, Any]) -> Student:
        """
        Create new student with business validations

        Args:
            data: Student data dictionary

        Returns:
            Created Student object

        Raises:
            ValueError: If validation fails
        """
        # Business Rule: Email must be unique
        existing = self.repository.find_by_email(data['email'])
        if existing:
            raise ValueError(f"Email {data['email']} sudah terdaftar")

        # Business Rule: Validate study hours range
        if not 0 <= data['study_hours'] <= 168:  # Max hours in a week
            raise ValueError("Study hours harus antara 0-168 jam per minggu")

        # Business Rule: Validate attendance rate
        if not 0 <= data['attendance_rate'] <= 100:
            raise ValueError("Attendance rate harus antara 0-100%")

        # Create student
        student = Student(
            name=data['name'],
            email=data['email'],
            study_hours=data['study_hours'],
            attendance_rate=data['attendance_rate'],
            gpa=data.get('gpa')
        )

        return self.repository.create(student)

    def get_student_by_id(self, student_id: int) -> Optional[Student]:
        """
        Get student by ID

        Args:
            student_id: Student ID

        Returns:
            Student object or None
        """
        return self.repository.find_by_id(student_id)

    def get_all_students(self) -> List[Student]:
        """
        Get all students

        Returns:
            List of students
        """
        return self.repository.find_all()

    def update_student(self, student_id: int, data: Dict[str, Any]) -> Optional[Student]:
        """
        Update existing student

        Args:
            student_id: Student ID
            data: Updated data

        Returns:
            Updated Student or None if not found

        Raises:
            ValueError: If validation fails
        """
        # Check if student exists
        existing = self.repository.find_by_id(student_id)
        if not existing:
            return None

        # Business Rule: If email is being changed, check uniqueness
        if 'email' in data and data['email'] != existing.email:
            email_exists = self.repository.find_by_email(data['email'])
            if email_exists:
                raise ValueError(f"Email {data['email']} sudah terdaftar")

        # Business Rule: Validate ranges
        if 'study_hours' in data:
            if not 0 <= data['study_hours'] <= 168:
                raise ValueError("Study hours harus antara 0-168 jam per minggu")

        if 'attendance_rate' in data:
            if not 0 <= data['attendance_rate'] <= 100:
                raise ValueError("Attendance rate harus antara 0-100%")

        # Update student
        updated_student = Student(
            name=data.get('name', existing.name),
            email=data.get('email', existing.email),
            study_hours=data.get('study_hours', existing.study_hours),
            attendance_rate=data.get('attendance_rate', existing.attendance_rate),
            gpa=data.get('gpa', existing.gpa)
        )

        return self.repository.update(student_id, updated_student)

    def delete_student(self, student_id: int) -> bool:
        """
        Delete student

        Args:
            student_id: Student ID

        Returns:
            True if deleted, False if not found
        """
        return self.repository.delete(student_id)

    def get_student_statistics(self) -> Dict[str, Any]:
        """
        Get student statistics (Business Logic Example)

        Returns:
            Dictionary with statistics
        """
        students = self.repository.find_all()

        if not students:
            return {
                'total_students': 0,
                'average_study_hours': 0,
                'average_attendance': 0,
                'average_gpa': 0
            }

        total = len(students)
        total_study_hours = sum(s.study_hours for s in students)
        total_attendance = sum(s.attendance_rate for s in students)
        students_with_gpa = [s for s in students if s.gpa is not None]
        total_gpa = sum(s.gpa for s in students_with_gpa) if students_with_gpa else 0

        return {
            'total_students': total,
            'average_study_hours': round(total_study_hours / total, 2),
            'average_attendance': round(total_attendance / total, 2),
            'average_gpa': round(total_gpa / len(students_with_gpa), 2) if students_with_gpa else 0
        }


# Singleton instance
student_service = StudentService()
