"""
Student Controller
==================
Presentation Layer untuk Student API

Controller bertanggung jawab untuk:
- Handle HTTP requests
- Validate input menggunakan schemas
- Call service layer
- Format HTTP responses

Tidak ada business logic di sini!
"""

from flask import request
from marshmallow import ValidationError

from app.api import api_bp
from app.services.student_service import student_service
from app.api.schemas.student_schema import (
    student_schema,
    students_schema,
    student_create_schema,
    student_update_schema
)
from app.utils.response import success_response, error_response


@api_bp.route('/students', methods=['GET'])
def get_students():
    """
    Get all students

    GET /api/students

    Response:
        200: List of students
    """
    try:
        students = student_service.get_all_students()
        data = students_schema.dump(students)

        return success_response(
            data=data,
            message=f"Berhasil mengambil {len(data)} students"
        )

    except Exception as e:
        return error_response(
            message="Gagal mengambil data students",
            status_code=500
        )


@api_bp.route('/students/<int:student_id>', methods=['GET'])
def get_student(student_id: int):
    """
    Get student by ID

    GET /api/students/<id>

    Response:
        200: Student data
        404: Student not found
    """
    try:
        student = student_service.get_student_by_id(student_id)

        if not student:
            return error_response(
                message=f"Student dengan ID {student_id} tidak ditemukan",
                status_code=404
            )

        data = student_schema.dump(student)
        return success_response(
            data=data,
            message="Berhasil mengambil data student"
        )

    except Exception as e:
        return error_response(
            message="Gagal mengambil data student",
            status_code=500
        )


@api_bp.route('/students', methods=['POST'])
def create_student():
    """
    Create new student

    POST /api/students

    Request Body:
        {
            "name": "string",
            "email": "string",
            "study_hours": float,
            "attendance_rate": float,
            "gpa": float (optional)
        }

    Response:
        201: Student created
        400: Validation error
    """
    try:
        # Validate request body
        json_data = request.get_json()
        if not json_data:
            return error_response(
                message="Request body harus JSON",
                status_code=400
            )

        # Validate dengan schema
        data = student_create_schema.load(json_data)

        # Call service layer
        student = student_service.create_student(data)

        # Serialize response
        result = student_schema.dump(student)

        return success_response(
            data=result,
            message="Student berhasil dibuat",
            status_code=201
        )

    except ValidationError as e:
        return error_response(
            message="Validasi gagal",
            errors=e.messages,
            status_code=400
        )

    except ValueError as e:
        return error_response(
            message=str(e),
            status_code=400
        )

    except Exception as e:
        return error_response(
            message="Gagal membuat student",
            status_code=500
        )


@api_bp.route('/students/<int:student_id>', methods=['PUT'])
def update_student(student_id: int):
    """
    Update student

    PUT /api/students/<id>

    Request Body:
        {
            "name": "string" (optional),
            "email": "string" (optional),
            "study_hours": float (optional),
            "attendance_rate": float (optional),
            "gpa": float (optional)
        }

    Response:
        200: Student updated
        400: Validation error
        404: Student not found
    """
    try:
        # Validate request body
        json_data = request.get_json()
        if not json_data:
            return error_response(
                message="Request body harus JSON",
                status_code=400
            )

        # Validate dengan schema (partial=True untuk update)
        data = student_update_schema.load(json_data)

        # Call service layer
        student = student_service.update_student(student_id, data)

        if not student:
            return error_response(
                message=f"Student dengan ID {student_id} tidak ditemukan",
                status_code=404
            )

        # Serialize response
        result = student_schema.dump(student)

        return success_response(
            data=result,
            message="Student berhasil diupdate"
        )

    except ValidationError as e:
        return error_response(
            message="Validasi gagal",
            errors=e.messages,
            status_code=400
        )

    except ValueError as e:
        return error_response(
            message=str(e),
            status_code=400
        )

    except Exception as e:
        return error_response(
            message="Gagal mengupdate student",
            status_code=500
        )


@api_bp.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id: int):
    """
    Delete student

    DELETE /api/students/<id>

    Response:
        200: Student deleted
        404: Student not found
    """
    try:
        deleted = student_service.delete_student(student_id)

        if not deleted:
            return error_response(
                message=f"Student dengan ID {student_id} tidak ditemukan",
                status_code=404
            )

        return success_response(
            message="Student berhasil dihapus"
        )

    except Exception as e:
        return error_response(
            message="Gagal menghapus student",
            status_code=500
        )


@api_bp.route('/students/statistics', methods=['GET'])
def get_statistics():
    """
    Get student statistics

    GET /api/students/statistics

    Response:
        200: Statistics data
    """
    try:
        stats = student_service.get_student_statistics()

        return success_response(
            data=stats,
            message="Berhasil mengambil statistik"
        )

    except Exception as e:
        return error_response(
            message="Gagal mengambil statistik",
            status_code=500
        )
