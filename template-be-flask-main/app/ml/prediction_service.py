"""
Prediction Service
==================
Service untuk ML predictions

Untuk production, load trained model dari ml_models/ folder.
Contoh ini menggunakan simple rule-based model untuk demonstrasi.

Cara integrate real ML model:
1. Train model (scikit-learn, TensorFlow, PyTorch, etc)
2. Save model ke ml_models/ folder (joblib, pickle, .h5, etc)
3. Load model di __init__ method
4. Update predict() method untuk menggunakan trained model
"""

import os
from typing import Dict, Any
from pathlib import Path


class PredictionService:
    """
    Service untuk GPA prediction

    Simple rule-based model untuk demonstrasi.
    Ganti dengan trained ML model untuk production.
    """

    def __init__(self):
        """Initialize prediction service"""
        self.model_version = "1.0.0-simple"
        self.model_path = Path(__file__).parent.parent.parent / "ml_models"

        # Untuk production: Load trained model
        # self.model = joblib.load(self.model_path / "gpa_model.pkl")

    def predict_gpa(self, study_hours: float, attendance_rate: float) -> Dict[str, Any]:
        """
        Predict student GPA based on study hours and attendance

        Args:
            study_hours: Weekly study hours (0-168)
            attendance_rate: Attendance percentage (0-100)

        Returns:
            Dictionary dengan predicted_gpa, confidence, dll

        Simple Formula (untuk demonstrasi):
            GPA = 1.0 + (study_hours / 168) * 1.5 + (attendance_rate / 100) * 1.5
            Range: 1.0 - 4.0

        Untuk production, ganti dengan:
            features = np.array([[study_hours, attendance_rate]])
            prediction = self.model.predict(features)
        """

        # Simple rule-based calculation
        # Normalize inputs
        normalized_study = min(study_hours / 168, 1.0)
        normalized_attendance = min(attendance_rate / 100, 1.0)

        # Calculate GPA (1.0 - 4.0 scale)
        base_gpa = 1.0
        study_contribution = normalized_study * 1.5
        attendance_contribution = normalized_attendance * 1.5

        predicted_gpa = base_gpa + study_contribution + attendance_contribution

        # Ensure within valid range
        predicted_gpa = max(0.0, min(4.0, predicted_gpa))

        # Calculate confidence (simple heuristic)
        # Higher confidence when both metrics are balanced
        balance_factor = 1.0 - abs(normalized_study - normalized_attendance)
        confidence = 0.7 + (balance_factor * 0.3)  # 0.7 - 1.0

        return {
            'predicted_gpa': round(predicted_gpa, 2),
            'study_hours': study_hours,
            'attendance_rate': attendance_rate,
            'confidence': round(confidence, 2),
            'model_version': self.model_version,
            'explanation': self._get_explanation(predicted_gpa, study_hours, attendance_rate)
        }

    def _get_explanation(self, gpa: float, study_hours: float, attendance_rate: float) -> str:
        """
        Generate explanation for prediction

        Args:
            gpa: Predicted GPA
            study_hours: Study hours input
            attendance_rate: Attendance rate input

        Returns:
            Human-readable explanation
        """
        if gpa >= 3.5:
            return "Excellent performance! Study hours dan attendance sangat baik."
        elif gpa >= 3.0:
            return "Good performance. Pertahankan study hours dan attendance Anda."
        elif gpa >= 2.5:
            return "Average performance. Consider meningkatkan study hours atau attendance."
        else:
            return "Below average. Strongly recommended untuk meningkatkan study hours dan attendance."

    def batch_predict(self, data: list) -> list:
        """
        Batch prediction untuk multiple inputs

        Args:
            data: List of dicts dengan 'study_hours' dan 'attendance_rate'

        Returns:
            List of predictions
        """
        predictions = []
        for item in data:
            prediction = self.predict_gpa(
                study_hours=item['study_hours'],
                attendance_rate=item['attendance_rate']
            )
            predictions.append(prediction)

        return predictions


# Singleton instance
prediction_service = PredictionService()
