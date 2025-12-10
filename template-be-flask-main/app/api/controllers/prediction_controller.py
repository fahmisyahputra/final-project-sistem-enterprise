"""
Prediction Controller
=====================
Controller untuk ML prediction endpoints

Handle requests untuk GPA prediction.
"""

from flask import request
from marshmallow import ValidationError

from app.api import api_bp
from app.ml.prediction_service import prediction_service
from app.api.schemas.student_schema import (
    prediction_request_schema,
    prediction_response_schema
)
from app.utils.response import success_response, error_response


@api_bp.route('/predict/gpa', methods=['POST'])
def predict_gpa():
    """
    Predict student GPA

    POST /api/predict/gpa

    Request Body:
        {
            "study_hours": float,
            "attendance_rate": float
        }

    Response:
        200: Prediction result
        400: Validation error

    Example:
        curl -X POST http://localhost:5000/api/predict/gpa \\
             -H "Content-Type: application/json" \\
             -d '{"study_hours": 20, "attendance_rate": 85}'
    """
    try:
        # Validate request
        json_data = request.get_json()
        if not json_data:
            return error_response(
                message="Request body harus JSON",
                status_code=400
            )

        # Validate dengan schema
        data = prediction_request_schema.load(json_data)

        # Call ML service
        prediction = prediction_service.predict_gpa(
            study_hours=data['study_hours'],
            attendance_rate=data['attendance_rate']
        )

        return success_response(
            data=prediction,
            message="Prediksi berhasil"
        )

    except ValidationError as e:
        return error_response(
            message="Validasi gagal",
            errors=e.messages,
            status_code=400
        )

    except Exception as e:
        return error_response(
            message="Gagal melakukan prediksi",
            status_code=500
        )


@api_bp.route('/predict/batch', methods=['POST'])
def predict_batch():
    """
    Batch GPA prediction

    POST /api/predict/batch

    Request Body:
        {
            "data": [
                {"study_hours": float, "attendance_rate": float},
                {"study_hours": float, "attendance_rate": float}
            ]
        }

    Response:
        200: List of predictions
        400: Validation error

    Example:
        curl -X POST http://localhost:5000/api/predict/batch \\
             -H "Content-Type: application/json" \\
             -d '{"data": [{"study_hours": 20, "attendance_rate": 85}, {"study_hours": 10, "attendance_rate": 60}]}'
    """
    try:
        # Validate request
        json_data = request.get_json()
        if not json_data or 'data' not in json_data:
            return error_response(
                message="Request body harus JSON dengan field 'data'",
                status_code=400
            )

        data_list = json_data['data']

        if not isinstance(data_list, list):
            return error_response(
                message="Field 'data' harus berupa array",
                status_code=400
            )

        # Validate each item
        validated_data = []
        for idx, item in enumerate(data_list):
            try:
                validated = prediction_request_schema.load(item)
                validated_data.append(validated)
            except ValidationError as e:
                return error_response(
                    message=f"Validasi gagal pada item index {idx}",
                    errors=e.messages,
                    status_code=400
                )

        # Call ML service for batch prediction
        predictions = prediction_service.batch_predict(validated_data)

        return success_response(
            data={'predictions': predictions, 'count': len(predictions)},
            message=f"Berhasil memprediksi {len(predictions)} data"
        )

    except Exception as e:
        return error_response(
            message="Gagal melakukan batch prediction",
            status_code=500
        )
