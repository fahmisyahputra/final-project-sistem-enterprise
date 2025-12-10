# ML Models Folder

Folder ini untuk menyimpan trained machine learning models.

## Format yang Didukung

- `.pkl` - Pickle (scikit-learn, general Python objects)
- `.joblib` - Joblib (lebih efisien untuk scikit-learn)
- `.h5` - Keras/TensorFlow models
- `.pt` / `.pth` - PyTorch models
- `.onnx` - ONNX format (cross-platform)

## Contoh Penggunaan

### Save Model (Training)
```python
import joblib
from sklearn.ensemble import RandomForestRegressor

# Train model
model = RandomForestRegressor()
model.fit(X_train, y_train)

# Save model
joblib.dump(model, 'ml_models/gpa_model.pkl')
```

### Load Model (Prediction Service)
```python
import joblib

# Load model
model = joblib.load('ml_models/gpa_model.pkl')

# Predict
prediction = model.predict([[feature1, feature2]])
```

## Notes

- **JANGAN commit** model yang terlalu besar ke Git
- Gunakan Git LFS untuk model >100MB
- Atau simpan model di cloud storage (S3, GCS, Azure Blob)
