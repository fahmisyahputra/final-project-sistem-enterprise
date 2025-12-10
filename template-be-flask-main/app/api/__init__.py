"""
API Module
==========
REST API Blueprint

Study Case: Student Management & GPA Prediction

Endpoints:
- Students CRUD: /api/students
- GPA Prediction: /api/predict/gpa
"""

from flask import Blueprint, jsonify

api_bp = Blueprint('api', __name__)


@api_bp.route('/', methods=['GET'])
def api_info():
    """
    API Information

    GET /api/
    """
    return jsonify({
        'success': True,
        'version': '1.0.0',
        'message': 'Flask API Template - Clean Architecture',
        'study_case': 'Student Management & GPA Prediction',
        'endpoints': {
            'students': {
                'GET /api/students': 'Get all students',
                'GET /api/students/<id>': 'Get student by ID',
                'POST /api/students': 'Create new student',
                'PUT /api/students/<id>': 'Update student',
                'DELETE /api/students/<id>': 'Delete student',
                'GET /api/students/statistics': 'Get statistics'
            },
            'predictions': {
                'POST /api/predict/gpa': 'Predict student GPA',
                'POST /api/predict/batch': 'Batch GPA prediction'
            }
        },
        'documentation': 'See README.md for full documentation'
    })


# Import controllers (harus setelah blueprint definition)
from app.api.controllers import student_controller
from app.api.controllers import prediction_controller
