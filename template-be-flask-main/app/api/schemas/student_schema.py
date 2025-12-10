"""
Student Schemas
===============
Request/Response schemas untuk Student API

Menggunakan Marshmallow untuk validation dan serialization.
Memisahkan representasi API dari domain model.
"""

from marshmallow import Schema, fields, validate, validates, ValidationError


class StudentSchema(Schema):
    """Schema untuk response Student (full data)"""

    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    email = fields.Email(required=True)
    study_hours = fields.Float(required=True)
    attendance_rate = fields.Float(required=True)
    gpa = fields.Float(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class StudentCreateSchema(Schema):
    """
    Schema untuk create Student request

    Validations:
    - name: required, min 2 chars, max 100 chars
    - email: required, valid email format
    - study_hours: required, 0-168 (max hours in a week)
    - attendance_rate: required, 0-100 (percentage)
    - gpa: optional, 0-4.0 scale
    """

    name = fields.Str(
        required=True,
        validate=[
            validate.Length(min=2, max=100, error="Nama harus 2-100 karakter")
        ],
        error_messages={
            'required': 'Nama wajib diisi'
        }
    )

    email = fields.Email(
        required=True,
        error_messages={
            'required': 'Email wajib diisi',
            'invalid': 'Format email tidak valid'
        }
    )

    study_hours = fields.Float(
        required=True,
        validate=[
            validate.Range(min=0, max=168, error="Study hours harus 0-168 jam/minggu")
        ],
        error_messages={
            'required': 'Study hours wajib diisi'
        }
    )

    attendance_rate = fields.Float(
        required=True,
        validate=[
            validate.Range(min=0, max=100, error="Attendance rate harus 0-100%")
        ],
        error_messages={
            'required': 'Attendance rate wajib diisi'
        }
    )

    gpa = fields.Float(
        allow_none=True,
        validate=[
            validate.Range(min=0, max=4.0, error="GPA harus 0-4.0")
        ]
    )


class StudentUpdateSchema(Schema):
    """
    Schema untuk update Student request
    All fields optional (partial update)
    """

    name = fields.Str(
        validate=[
            validate.Length(min=2, max=100, error="Nama harus 2-100 karakter")
        ]
    )

    email = fields.Email(
        error_messages={
            'invalid': 'Format email tidak valid'
        }
    )

    study_hours = fields.Float(
        validate=[
            validate.Range(min=0, max=168, error="Study hours harus 0-168 jam/minggu")
        ]
    )

    attendance_rate = fields.Float(
        validate=[
            validate.Range(min=0, max=100, error="Attendance rate harus 0-100%")
        ]
    )

    gpa = fields.Float(
        allow_none=True,
        validate=[
            validate.Range(min=0, max=4.0, error="GPA harus 0-4.0")
        ]
    )


class PredictionRequestSchema(Schema):
    """
    Schema untuk GPA prediction request

    Input features untuk model ML:
    - study_hours: Weekly study hours
    - attendance_rate: Attendance percentage
    """

    study_hours = fields.Float(
        required=True,
        validate=[
            validate.Range(min=0, max=168, error="Study hours harus 0-168 jam/minggu")
        ],
        error_messages={
            'required': 'Study hours wajib diisi'
        }
    )

    attendance_rate = fields.Float(
        required=True,
        validate=[
            validate.Range(min=0, max=100, error="Attendance rate harus 0-100%")
        ],
        error_messages={
            'required': 'Attendance rate wajib diisi'
        }
    )


class PredictionResponseSchema(Schema):
    """Schema untuk prediction response"""

    predicted_gpa = fields.Float(required=True)
    study_hours = fields.Float(required=True)
    attendance_rate = fields.Float(required=True)
    confidence = fields.Float(allow_none=True)
    model_version = fields.Str(allow_none=True)


# Schema instances untuk reuse
student_schema = StudentSchema()
students_schema = StudentSchema(many=True)
student_create_schema = StudentCreateSchema()
student_update_schema = StudentUpdateSchema()
prediction_request_schema = PredictionRequestSchema()
prediction_response_schema = PredictionResponseSchema()
