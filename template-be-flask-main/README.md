# Organizational Mining Backend API

FastAPI-based backend for Organizational Mining, designed to analyze and visualize process mining data from Neo4j. Built with **Clean Architecture** principles.

## Overview
**Organizational Mining System**

This system provides analytics services for:
- **Organizational Evolution:** Tracking active users, roles, and interactions over time.
- **Role Interactions:** Analyzing connectivity and weight between different roles.
- **User Collaboration:** Detailed view of user-to-user interactions within roles.
- **Process Discovery:** BPMN-like visualization of process flows.
- **Performance Analytics:** Overtime risk and project duration analysis.
- **Advanced Analytics:** Bottleneck analysis (handover duration) and resource utilization heatmaps.

## Architecture

This project follows **Clean Architecture**:

```
┌─────────────────────────────────────────┐
│   Presentation Layer (Routers/API)      │  ← FastAPI Routers
├─────────────────────────────────────────┤
│   Business Logic Layer (Services)       │  ← Analytics Logic
├─────────────────────────────────────────┤
│   Data Access Layer (Neo4j)             │  ← Database Driver
├─────────────────────────────────────────┤
│   Domain Layer (Models/Schemas)         │  ← Pydantic Models
└─────────────────────────────────────────┘
```

### Folder Structure

```
template-be-flask-main/
├── app/
│   ├── __init__.py
│   ├── main.py                          # Entry point
│   │
│   ├── models/                          # DOMAIN LAYER
│   │   └── schemas.py                   # Pydantic models
│   │
│   ├── services/                        # BUSINESS LOGIC LAYER
│   │   └── analytics.py                 # Analytics service (Neo4j queries)
│   │
│   ├── routers/                         # PRESENTATION LAYER
│   │   └── organization.py              # API endpoints
│   │
│   └── core/                            # CONFIG & UTILS
│       └── config.py                    # Environment config
│
├── requirements.txt                     # Dependencies
├── .env                                 # Environment variables
└── README.md
```

## Quick Start

### 1. Setup & Install

```bash
# Create virtual environment
python -m venv venv

# Activate (Mac/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configuration

Create a `.env` file in the root directory:

```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```

### 3. Run Server

```bash
# Run with Uvicorn (Hot Reload)
uvicorn app.main:app --reload
```

Server running at: **http://localhost:8000**

### 4. API Documentation

Open your browser to:
- Swagger UI: **http://localhost:8000/docs**
- ReDoc: **http://localhost:8000/redoc**

## API Endpoints

### Organization Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/organization/evolution` | Summary of active users, roles, and interactions |
| GET | `/organization/evolution-trend` | Monthly trend of evolution metrics |
| GET | `/organization/roles` | Interaction weights between roles |
| GET | `/organization/users` | User-to-user collaboration details |
| GET | `/organization/bpmn` | Nodes and edges for process graph |

### Performance Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/organization/overtime` | Top 5 users at risk of burnout (working off-hours) |
| GET | `/organization/project-durations` | Top 10 longest running cases |

### Advanced Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/organization/handovers` | Bottleneck analysis (avg duration between roles) |
| GET | `/organization/utilization` | Heatmap data (Day x Hour) |

## Tech Stack

- **Framework:** FastAPI
- **Database:** Neo4j (Graph Database)
- **Driver:** neo4j-python-driver
- **Validation:** Pydantic
- **Server:** Uvicorn

## License

MIT License
