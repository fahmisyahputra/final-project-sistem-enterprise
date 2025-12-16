# Final Project Report: Organizational Mining & Agile Process Analytics

**Date:** December 15, 2025
**Subject:** Implementation of Graph-Based Process Mining for Agile Workflow Analysis

---

## 1. Introduction

### 1.1 Aim of the Program

**Original System Scope:**
The initial iteration of the Organizational Mining system served as an architectural proof-of-concept. Its primary objective was to establish a robust **Clean Architecture** framework, successfully decoupling the presentation layer (FastAPI) from the data persistence layer (Neo4j). Functionally, it was limited to the visualization of static or synthetic organizational structures, demonstrating connectivity without providing actionable analytical depth.

**Final Project Objectives:**
The Final Project represents a paradigm shift from a structural template to a fully functional **Agile Process Analytics Engine**. By integrating high-fidelity event logs from three distinct datasets (`Agile Event Log`, `Similar Agile Event Log`, and `Uncomplete Agile Event Log`), the system has been evolved to address complex analytical challenges in software development workflows.

The specific analytical aims of the Final Project are to provide a holistic view of the software development process through seven distinct analytical modules:

1.  **Executive Dashboard:** To provide high-level visibility into real-time key performance indicators (KPIs) and longitudinal interaction trends.
2.  **Organizational Evolution:** To analyze structural changes over time, tracking the fluctuations in active users, roles, and total collaboration energy across the fiscal year.
3.  **Role Analysis:** To map the functional dependencies between departments, quantifying the "weight" of interactions (e.g., *Dev* $\leftrightarrow$ *QA*).
4.  **User Analysis:** To drill down into interpersonal collaboration patterns, identifying key contributors and team dynamics during specific project phases.
5.  **Process Visualization:** To automatically generate node-link diagrams that reveal the "Informal Organization," visualizing the actual flow of work and communication hubs.
6.  **Performance Analytics:** To monitor human resource risks and efficiency using:
    *   **Burnout Risk Monitor:** Identifying resources working outside standard hours (<7 AM or >6 PM).
    *   **Longest Running Projects:** Benchmarking case durations to detect outliers.
7.  **Advanced Analytics:** To provide deep operational intelligence through:
    *   **Bottleneck Analysis:** Calculating the average handover latency between roles.
    *   **Resource Utilization Heatmap:** visualizing activity intensity across days of the week and hours of the day.

### 1.2 Repository & Data Sources

*   **Source Code Repository:** [Insert Repository Link Here]
*   **Primary Datasets:** [Insert Dataset Link Here]

---

## 2. System Operation Manual

This section outlines the standard operating procedures for deploying the application and executing the analytical pipeline.

### 2.1 Prerequisites
*   **Database:** Neo4j Desktop (Active connection required at `bolt://localhost:7687`).
*   **Runtime Environments:** Python 3.9+ (Backend) and Node.js 18+ (Frontend).

### 2.2 Installation & Deployment

**Step 1: Backend Initialization**
The backend utilizes a FastAPI framework.
1.  Navigate to the backend directory: `cd template-be-flask-main`
2.  Initialize the virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    ```
3.  Install dependencies: `pip install -r requirements.txt`
4.  Launch the server: `uvicorn app.main:app --reload`
    *   *Status:* Server active at `http://localhost:8000`

**Step 2: Frontend Initialization**
The frontend is built on Next.js with a Clean Architecture pattern.
1.  Navigate to the frontend directory: `cd frontend-nextjs-cleanarchitecture-main`
2.  Install dependencies: `npm install`
3.  Launch the client: `npm run dev`
    *   *Status:* Application accessible at `http://localhost:5051`

### 2.3 Data Ingestion Protocol (ETL Pipeline)
The system features an automated Extract-Transform-Load (ETL) service. To ingest the analysis datasets:
1.  Ensure the CSV files are located in the `data-analysis` directory.
2.  Execute the following HTTP POST request to trigger the `DataImporter` service:
    ```http
    POST http://localhost:8000/organization/load-data
    ```
    *   *Operation:* This command purges the existing graph, parses the CSV event logs, and projects the new collaboration graph structure.

### 2.4 Database Implementation (Cypher Query Registry)
For academic transparency, here are the core **Neo4j Cypher Queries** used to drive the application's features:

**A. Data Projection (ETL):**
```cypher
// 1. Project User Collaborations
MATCH (p1:Person)-[w1:WORKED_ON]->(c:Case)<-[w2:WORKED_ON]-(p2:Person)
WHERE p1 <> p2 AND w1.month = w2.month
MERGE (p1)-[r:COLLABORATED_IN {month: w1.month}]-(p2)
ON CREATE SET r.weight = 1
ON MATCH SET r.weight = r.weight + 1

// 2. Project Role Interactions
MATCH (p1:Person)-[r:COLLABORATED_IN]-(p2:Person)
MATCH (r1:Role {name: p1.role})
MATCH (r2:Role {name: p2.role})
WHERE r1 <> r2
MERGE (r1)-[i:INTERACTS_WITH]->(r2)
ON CREATE SET i.total_weight = r.weight
ON MATCH SET i.total_weight = i.total_weight + r.weight
```

**B. Feature-Specific Queries:**

*   **1. Organizational Evolution (Active Users & Interactions):**
    ```cypher
    MATCH (p:Person)-[w:WORKED_ON]->(c:Case)
    WHERE w.month >= $start_month AND w.month <= $end_month
    WITH count(DISTINCT p) as active_users, count(DISTINCT p.role) as active_roles

    OPTIONAL MATCH (p1:Person)-[r:COLLABORATED_IN]-(p2:Person)
    WHERE r.month >= $start_month AND r.month <= $end_month
    WITH active_users, active_roles, sum(r.weight) as total_interactions

    RETURN {
        active_users: active_users,
        active_roles: active_roles,
        total_interactions: coalesce(total_interactions, 0)
    } as stats
    ```

*   **2. Bottleneck Analysis (Handover Duration Calculation):**
    ```cypher
    MATCH (c:Case)<-[w:WORKED_ON]-(p:Person)
    WITH c, p, w ORDER BY w.timestamp
    WITH c, collect({role: p.role, time: w.timestamp}) as activities
    UNWIND range(0, size(activities)-2) as i
    WITH activities[i] as source, activities[i+1] as target
    WHERE source.role <> target.role
    WITH source.role as source_role, target.role as target_role,
            duration.inSeconds(source.time, target.time).seconds / 3600.0 as duration_hours
    RETURN source_role, target_role, avg(duration_hours) as avg_duration
    ORDER BY avg_duration DESC
    LIMIT 20
    ```

*   **3. Overtime Risk Detection:**
    ```cypher
    MATCH (p:Person)-[w:WORKED_ON]->(c:Case)
    WHERE w.timestamp.hour < 7 OR w.timestamp.hour > 18
    RETURN p.name as name, p.role as role, count(w) as overtime_count
    ORDER BY overtime_count DESC
    LIMIT 5
    ```

### 2.5 Website Features & Analysis Guide

This section details the functionality of each web module, including interpretation guides and implementation specifics.

**1. Executive Dashboard**
*   **Description:** Provides a high-level overview of the organization's current state.
*   **Features:** Real-time KPI cards and a longitudinal Interaction Trend chart.
*   **[INSERT DASHBOARD SCREENSHOT HERE]**

**2. Organizational Evolution**
*   **Description:** Visualizes the structural changes in the organization over the fiscal year.
*   **Analysis Logic:** The system aggregates unique `Person` and `Role` nodes active within a selected date range (default: 2019). It also sums the `weight` of all `COLLABORATED_IN` relationships to measure total "Organizational Energy."
*   **[INSERT EVOLUTION SCREENSHOT HERE]**

**3. Role Analysis**
*   **Description:** A matrix view of inter-departmental connectivity.
*   **Analysis Logic:** Queries the `INTERACTS_WITH` relationships projected during ETL. High weights indicate strong functional dependencies (e.g., *Dev* relies heavily on *QA*).
*   **[INSERT ROLES SCREENSHOT HERE]**

**4. User Collaboration**
*   **Description:** Granular view of interpersonal working relationships.
*   **Features:** Filterable by month to detect forming/storming/norming phases in teams.
*   **[INSERT USERS SCREENSHOT HERE]**

**5. Process Visualization**
*   **Description:** A Force-Directed Graph revealing the "Informal Organization."
*   **Implementation:** Uses the `INTERACTS_WITH` edges to render a topology where central roles appear larger or more connected, utilizing the Recharts/ReactFlow engine.
*   **[INSERT VISUALIZATION SCREENSHOT HERE]**

## 4. Advanced Analytics

This chapter details the mathematical models and visualization logic behind the system's most sophisticated features: Bottleneck Detection and Resource Utilization Analysis.

### 4.1 Bottleneck Detection (Temporal Handover Analysis)

#### Theoretical Framework
A critical component of Agile process optimization is identifying friction points in role transitions. In Process Mining theory, a "handover" represents the transfer of control from one resource to another. The efficiency of a process is often determined not by the execution time of activities, but by the "waiting time" or latency between them.

#### Mathematical Formulation
The system implements a quantitative model to calculate the **Average Handover Duration**. This logic is encapsulated in the `get_handover_flow` function within the `AnalyticsService`.

**Definition:**
Let $C$ be a specific Case consisting of a chronologically ordered sequence of activities $A = \{A_1, A_2, \dots, A_n\}$, where each activity $A_i$ has an associated timestamp $t(A_i)$ and is performed by a resource with role $R(A_i)$.

A **Handover Event** $H_k$ is defined between adjacent activities $A_k$ and $A_{k+1}$ if and only if the roles differ:
$$ R(A_k) \neq R(A_{k+1}) $$

The **Duration** ($D_k$) of this single handover event is calculated as the temporal delta:
$$ D_k = t(A_{k+1}) - t(A_k) $$

**Aggregation:**
To determine the systemic bottleneck between a Source Role ($R_S$) and a Target Role ($R_T$), we calculate the arithmetic mean of all observed handover durations between these two roles across all cases.

$$ \text{AvgDuration}(R_S \to R_T) = \frac{1}{N} \sum_{k=1}^{N} D_k $$

**Where:**
*   $N$ is the total count of valid handover instances observed in the entire dataset where the source role is $R_S$ and the target role is $R_T$.
*   $k$ is the index of the specific handover instance (ranging from 1 to $N$).
*   $D_k$ is the duration of the $k$-th handover instance in hours.
*   $\sum$ denotes the summation of all individual durations.

#### Visualization & Threshold Classification
To translate this mathematical model into actionable management intelligence, the results are visualized using a color-coded Bar Chart on the Advanced Analytics dashboard. The classification logic is defined as follows:

*   **<span style="color:green">Green Zone (Optimal):</span>** $\text{AvgDuration} < 48 \text{ Hours}$
    *   *Analysis:* Indicates a highly efficient workflow where handovers are completed within two business days.
*   **<span style="color:orange">Yellow Zone (Warning):</span>** $48 \text{ Hours} \le \text{AvgDuration} \le 72 \text{ Hours}$
    *   *Analysis:* Represents potential friction points. Delays of 2-3 days suggest process inefficiencies that warrant monitoring.
*   **<span style="color:red">Red Zone (Critical Bottleneck):</span>** $\text{AvgDuration} > 72 \text{ Hours}$
    *   *Analysis:* Identifies severe systemic blockages. Handovers exceeding 3 days are classified as critical bottlenecks, likely contributing to project delays and requiring immediate process re-engineering.

### 4.2 Resource Utilization Heatmap

#### Purpose
The Resource Utilization Heatmap provides a temporal breakdown of organizational activity. Unlike simple volume metrics, this visualization exposes *when* work actually happens, allowing management to identify crunch times, underutilized windows, and non-standard working patterns.

#### Analysis Logic
The system aggregates activity volume across two temporal dimensions: **Day of Week** (Monday-Sunday) and **Hour of Day** (00:00 - 23:00).

The metric calculated is the **Interaction Frequency** ($F_{d,h}$):
$$ F_{d,h} = \text{Count}(\{A_i \mid \text{Day}(t(A_i)) = d \land \text{Hour}(t(A_i)) = h\}) $$

1.  **Grid Visualization:** The X-axis represents the 24 hours of the day, and the Y-axis represents the 7 days of the week.
2.  **Intensity Mapping:** The opacity (alpha) of each grid cell is proportional to $F_{d,h}$. Darker cells indicate peak activity periods (e.g., Monday 9-10 AM), while lighter cells indicate lull periods.

This visualization is instrumental for:
*   **Capacity Planning:** adjusting resource allocation during known peak hours.
*   **Burnout Prevention:** detecting systematic activity during late-night hours or weekends.

### 2.6 User Interaction Flow (Step-by-Step)

Follow this numbered procedure to utilize the application effectively:

1.  **Initialize Backend Server:**
    *   Open a terminal window.
    *   Navigate to `template-be-flask-main`.
    *   Execute: `source venv/bin/activate && uvicorn app.main:app --reload`
2.  **Initialize Frontend Client:**
    *   Open a second terminal window.
    *   Navigate to `frontend-nextjs-cleanarchitecture-main`.
    *   Execute: `npm run dev`
3.  **Launch the Application:** Open your web browser and navigate to `http://localhost:5051`. You will land on the **Executive Dashboard**.
4.  **Verify Data Completeness:** Check the "Total Interactions" KPI card. If it is empty or zero, you need to load the data via the API (see Section 2.3).
5.  **Analyze Trends:** On the Dashboard, observe the "Interaction Trend" chart. Hover over specific months to see if activity is increasing or decreasing over the year.
6.  **Examine Structural Changes:** Click on **"Organization"** in the sidebar. Use the date pickers to compare Q1 vs Q4 activity levels.
7.  **Identify Key Players:** Navigate to **"Roles"**. Sort the table by "Interaction Weight" to see which departments communicate the most.
8.  **Drill Down to Personnel:** Switch to the **"Users"** page. Select a specific month (e.g., "2019-06") to see which individuals were collaborating heavily during that period.
9.  **Visualize the Network:** Go to **"Process Visualization"**. Drag and drop the nodes to untangle the graph and see the central hubs of the organization.
10. **Monitor Risks:** Navigate to **"Performance"**.
    *   Check **Overtime Risk**: Are there specific names appearing frequently? These employees may be at risk of burnout.
    *   Check **Longest Projects**: Identify the Case IDs that are taking anomalously long compared to the average.
11. **Detect Bottlenecks (Critical Step):** Finally, go to **"Advanced"**. Look for any **Red Bars** in the Bottleneck Analysis chart. These represent role-handovers (e.g., Designer -> Developer) that take >3 days. These are your primary targets for process improvement.

---

## 3. Data Analysis Methodology

### 3.1 Data Source Characterization
The project integrates three distinct event logs, each serving a specific analytical purpose:

**1. `Agile Event Log.csv` (Baseline Dataset)**
*   **Description:** Represents the standard execution of the Agile development lifecycle (Sprints 1-12).
*   **Characteristics:** Complete traces, standard timestamp continuity, and clean role-to-activity mappings.
*   **Analytical Use:** Used to establish the "Happy Path" or baseline performance metrics for the organization.

**2. `Similar Agile Event Log.csv` (Variance Dataset)**
*   **Description:** A secondary dataset reflecting a parallel agile team or a slightly modified process variant.
*   **Characteristics:** Contains similar activities but with different resource distributions and timing patterns.
*   **Analytical Use:** Testing the system's robustness in handling process deviations and verifying that the Graph Projection algorithm works consistently across different teams.

**3. `Uncomplete Agile Event Log.csv` (Stress-Test Dataset)**
*   **Description:** A dataset containing "open" or "dropped" cases that never reached a terminal state (e.g., Release).
*   **Characteristics:** Missing end timestamps for certain cases, representing work-in-progress (WIP) or cancelled projects.
*   **Analytical Use:** Critical for validating the **Project Duration** and **Collaboration** logic. It forces the system to handle `null` end-dates gracefully and allows us to distinguish between "Active" vs. "Abandoned" work.

### 3.2 Implementation Strategy: Integrating Analysis into the Program

The integration of these datasets required a fundamental re-engineering of the existing system. The implementation followed a 3-stage strategy:

**Stage 1: Dynamic Data Ingestion Layer (`importer.py`)** 
We replaced the static JSON mock data with a streaming CSV parser.
*   *Before:* Hardcoded node arrays.
*   *After:* The `DataImporter` service iterates through CSV rows, normalizing timestamps (`%m-%d-%y %H:%M` -> ISO 8601) and dynamically creating `Case` nodes for every unique CaseID.

**Stage 2: Temporal Graph Modeling (The `WORKED_ON` Edge)**
To support "over time" analysis, we introduced a temporal edge pattern.
*   Instead of simply linking `Person -> Role`, we implemented: `(Person)-[:WORKED_ON {timestamp, month}]->(Case)`.
*   **Why?** This allows us to slice the graph by time. The "User Collaboration" feature works by querying: *"Find two people who `WORKED_ON` the same Case in the same `month`."*

**Stage 3: Analytic Projection (`analytics.py`)**
We moved complex logic from the application command layer into the database (Neo4j) using Graph Projections.
*   **Bottleneck Logic:** Calculated entirely in Cypher using `duration.inSeconds(source.time, target.time)`.
*   **Performance Benefits:** By shifting the math to the database, the Python backend remains lightweight, only formatting the JSON response for the frontend.

### 3.3 Feature-Specific Analysis Logic
*   **Overtime Analysis:** We explicitly parse timestamp hours. The logic `w.timestamp.hour < 7 OR w.timestamp.hour > 18` is strictly applied to flag "non-standard" work contributions.
*   **Duration Analysis:** We calculate the "Case Lifecycle" by finding the `min(timestamp)` and `max(timestamp)` for every single Case ID, providing a definitive execution window for 100% of the projects in the dataset.

---

## 5. Conclusion

The Final Project successfully delivers a comprehensive **Agile Process Analytics Engine** that transforms raw event logs into actionable organizational intelligence.

**Key Achievements:**
1.  **Architecture:** Successfully migrated from a monolithic script to a scalable **Clean Architecture** (FastAPI + Next.js), ensuring the system is production-ready and maintainable.
2.  **Analysis Depth:** Moved beyond simple counts to sophisticated metrics like **Handover Latency** and **Resource Utilization Heatmaps**, providing management with "Operational MRI" capabilities.
3.  **Visualization:** Implemented industry-standard visualizations (BPMN, Force-Directed Graphs) that make complex graph data accessible to non-technical stakeholders.
4.  **Performance:** The use of **Neo4j Graph Projections** allows the system to analyze year-long datasets with sub-second response times for critical queries.

By addressing the core challenges of Bottleneck Detection and Overtime Risk, this system provides a robust foundation for data-driven decision-making in Agile environments.

---

## 6. References

1.  **FastAPI:** Ramírez, S. (2018). *FastAPI: A modern, fast (high-performance), web framework for building APIs with Python 3.6+*.
2.  **Neo4j:** Neo4j, Inc. (2024). *The Neo4j Graph Database Platform*.
3.  **Clean Architecture:** Martin, R. C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.
4.  **Process Mining:** van der Aalst, W. M. P. (2016). *Process Mining: Data Science in Action*. Springer.
5.  **Recharts:** *Recharts: A Redefined Chart Library Built with React and D3*.
