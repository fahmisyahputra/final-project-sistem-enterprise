# Tests Folder

Folder ini untuk menyimpan automated tests.

## Testing Framework

Gunakan **pytest** untuk testing:

```bash
# Install
pip install pytest pytest-cov

# Run tests
pytest

# With coverage
pytest --cov=app
```

## Struktur Tests

```
tests/
├── test_models.py           # Test domain models
├── test_repositories.py     # Test data access layer
├── test_services.py         # Test business logic
├── test_controllers.py      # Test API endpoints
├── test_ml_services.py      # Test ML predictions
└── conftest.py              # Pytest fixtures
```

## Contoh Test

```python
# tests/test_services.py
import pytest
from app.services.student_service import StudentService
from app.repositories.student_repository import StudentRepository

def test_create_student():
    # Arrange
    repo = StudentRepository()
    service = StudentService(repository=repo)
    data = {
        "name": "Test Student",
        "email": "test@example.com",
        "study_hours": 20.0,
        "attendance_rate": 85.0
    }

    # Act
    student = service.create_student(data)

    # Assert
    assert student.id is not None
    assert student.name == "Test Student"
```

## Best Practices

- Write tests for business logic (services layer)
- Test edge cases and error handling
- Maintain >80% code coverage
- Run tests before committing code
