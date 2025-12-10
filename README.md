# Organizational Mining System

A comprehensive analytics platform for analyzing and visualizing organizational processes, role interactions, and resource utilization using Graph Database technology.

## 🚀 Project Overview

The **Organizational Mining System** is designed to provide deep insights into how an organization functions by analyzing event logs and interaction data. It moves beyond simple statistics to visualize the complex web of relationships and process flows within a company.

### Key Features
- **Organizational Evolution:** Track how active users, roles, and interaction volumes change over time.
- **Role Interaction Matrix:** Visualize the connectivity and weight of handovers between different roles.
- **User Collaboration:** Drill down into specific user-to-user collaboration patterns.
- **Process Discovery (BPMN):** Automatically generate node-link diagrams to visualize process flows.
- **Performance Analytics:** Monitor burnout risk (overtime) and identify long-running projects.
- **Advanced Analytics:** Analyze bottlenecks (handover duration) and resource utilization heatmaps.

## 🏗️ Architecture

The system follows a **Clean Architecture** pattern and consists of three main components:

```mermaid
graph LR
    A[Frontend (Next.js)] -->|REST API| B[Backend (FastAPI)]
    B -->|Bolt Protocol| C[Database (Neo4j)]
```

1.  **Frontend (`frontend-nextjs-cleanarchitecture-main`)**:
    *   **Framework:** Next.js 14 (App Router)
    *   **Styling:** Tailwind CSS + shadcn/ui
    *   **Visualization:** Recharts + React Flow + Dagre
    *   **State Management:** Redux Toolkit + React Query

2.  **Backend (`template-be-flask-main`)**:
    *   **Framework:** FastAPI (migrated from Flask)
    *   **Database Driver:** neo4j-python-driver
    *   **Architecture:** Clean Architecture (Router -> Service -> Repository -> Model)

3.  **Database**:
    *   **System:** Neo4j (Graph Database)
    *   **Data Model:** `(:Person)-[:WORKED_ON]->(:Case)` and `(:Role)-[:INTERACTS_WITH]->(:Role)`

## 🛠️ Prerequisites

Before running the project, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Neo4j Desktop** or **Neo4j AuraDB** (running instance)

## 🏁 Quick Start Guide

### 1. Database Setup (Neo4j)
Ensure your Neo4j instance is running and you have the connection URI, username, and password ready.

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd template-be-flask-main
```

Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file with your Neo4j credentials:
```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```

Run the backend server:
```bash
uvicorn app.main:app --reload
```
*Server will start at `http://localhost:8000`*

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend-nextjs-cleanarchitecture-main
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
*Application will start at `http://localhost:3000`*

## 📚 Documentation

For more detailed documentation on specific components, please refer to their respective README files:

- [**Backend Documentation**](./template-be-flask-main/README.md) - API Endpoints, Schema, and Service Logic.
- [**Frontend Documentation**](./frontend-nextjs-cleanarchitecture-main/README.md) - UI Components, Page Structure, and Visualization Libraries.

## 👥 Authors

**Group 2 - Enterprise Systems Class**

## 📄 License

MIT License
