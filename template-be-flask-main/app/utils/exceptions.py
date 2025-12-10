"""
Custom Exceptions
=================
Custom exception classes untuk aplikasi

Memudahkan error handling yang konsisten.
"""


class AppException(Exception):
    """Base exception untuk aplikasi"""

    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class ValidationException(AppException):
    """Exception untuk validation errors"""

    def __init__(self, message: str, errors: dict = None):
        super().__init__(message, status_code=400)
        self.errors = errors


class NotFoundException(AppException):
    """Exception untuk resource not found"""

    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status_code=404)


class UnauthorizedException(AppException):
    """Exception untuk unauthorized access"""

    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, status_code=401)


class ForbiddenException(AppException):
    """Exception untuk forbidden access"""

    def __init__(self, message: str = "Forbidden"):
        super().__init__(message, status_code=403)


class ConflictException(AppException):
    """Exception untuk conflict (e.g., duplicate data)"""

    def __init__(self, message: str = "Conflict"):
        super().__init__(message, status_code=409)
