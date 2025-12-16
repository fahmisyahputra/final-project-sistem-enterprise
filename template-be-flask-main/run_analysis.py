import csv
import os
from datetime import datetime
from app.db.neo4j import neo4j_driver
from app.services.analytics import AnalyticsService

DATA_DIR = "../data-analysis"
FILES = [
    "Agile Event Log.csv",
    "Similar Agile Event Log.csv",
    "Uncomplete Agile Event Log.csv"
]

def parse_timestamp(ts_str):
    # Format: 4-24-19 15:00 (MM-DD-YY HH:MM)
    try:
        dt = datetime.strptime(ts_str, "%m-%d-%y %H:%M")
        # Neo4j prefers ISO 8601
        return dt.isoformat(), dt.strftime("%Y-%m")
    except ValueError:
        return None, None

def load_data(session, file_path):
    print(f"Loading {file_path}...")
    count = 0
    with open(file_path, 'r') as f:
        reader = csv.DictReader(f, delimiter=';')
        for row in reader:
            # Data Quality Check
            if not row['CaseID'] or not row['timestamp'] or not row['Resource']:
                continue

            iso_time, month = parse_timestamp(row['timestamp'])
            if not iso_time:
                continue

            query = """
            MERGE (p:Person {name: $resource})
            SET p.role = $role
            MERGE (r:Role {name: $role})
            MERGE (c:Case {id: $case_id})
            CREATE (p)-[:WORKED_ON {
                activity: $activity,
                timestamp: datetime($timestamp),
                month: $month,
                source_file: $source_file
            }]->(c)
            """
            session.run(query, 
                        resource=row['Resource'],
                        role=row['Role'],
                        case_id=row['CaseID'],
                        activity=row['NameActivity'],
                        timestamp=iso_time,
                        month=month,
                        source_file=os.path.basename(file_path))
            count += 1
    print(f"Loaded {count} rows from {file_path}")

def project_graph(session):
    print("Projecting Graph Relationships...")
    
    # 1. User Collaborations (Person -> Person)
    # People working on the same Case in the same Month
    print("  - Creating COLLABORATED_IN relationships...")
    query_collab = """
    MATCH (p1:Person)-[w1:WORKED_ON]->(c:Case)<-[w2:WORKED_ON]-(p2:Person)
    WHERE p1 <> p2 AND w1.month = w2.month
    MERGE (p1)-[r:COLLABORATED_IN {month: w1.month}]-(p2)
    ON CREATE SET r.weight = 1
    ON MATCH SET r.weight = r.weight + 1
    """
    session.run(query_collab)

    # 2. Role Interactions (Role -> Role)
    # Derived from User Collaborations
    print("  - Creating INTERACTS_WITH relationships...")
    query_roles = """
    MATCH (p1:Person)-[r:COLLABORATED_IN]-(p2:Person)
    MATCH (r1:Role {name: p1.role})
    MATCH (r2:Role {name: p2.role})
    WHERE r1 <> r2
    MERGE (r1)-[i:INTERACTS_WITH]->(r2)
    ON CREATE SET i.total_weight = r.weight
    ON MATCH SET i.total_weight = i.total_weight + r.weight
    """
    session.run(query_roles)

def analyze_data(session):
    print("\n=== ANALYSIS RESULTS ===")
    service = AnalyticsService(session)

    # 1. Organization Evolution (Summary)
    print("\n1. Organization Evolution (2019 Summary)")
    # Assuming data is from 2019 based on CSV inspection
    stats = service.get_organization_evolution("2019-01", "2019-12")
    if stats:
        print(f"   Active Users: {stats['active_users']}")
        print(f"   Active Roles: {stats['active_roles']}")
        print(f"   Total Interactions: {stats['total_interactions']}")
    else:
        print("   No data found for 2019.")

    # 2. Top Role Interactions
    print("\n2. Top Role Interactions")
    interactions = service.get_top_interactions(5)
    print(f"   {'Role A':<20} | {'Role B':<20} | {'Weight':<10}")
    print(f"   {'-'*20}-+-{'-'*20}-+-{'-'*10}")
    for i in interactions:
        print(f"   {i['role_a']:<20} | {i['role_b']:<20} | {i['weight']:<10}")

    # 3. Overtime Risk
    print("\n3. Overtime Risk (Top 5 Users)")
    overtime = service.get_overtime_risk()
    print(f"   {'User':<15} | {'Role':<20} | {'Overtime Events':<15}")
    print(f"   {'-'*15}-+-{'-'*20}-+-{'-'*15}")
    for o in overtime:
        print(f"   {o['name']:<15} | {o['role']:<20} | {o['overtime_count']:<15}")

    # 4. Longest Projects
    print("\n4. Longest Projects (Top 5)")
    projects = service.get_project_durations()
    print(f"   {'Case ID':<35} | {'Duration (Days)':<15}")
    print(f"   {'-'*35}-+-{'-'*15}")
    for p in projects[:5]:
        print(f"   {p['case_id']:<35} | {p['duration_days']:<15}")

def main():
    with neo4j_driver.get_session() as session:
        # Clear DB for clean analysis
        print("Clearing Database...")
        session.run("MATCH (n) DETACH DELETE n")

        # Load
        for filename in FILES:
            file_path = os.path.join(DATA_DIR, filename)
            if os.path.exists(file_path):
                load_data(session, file_path)
            else:
                print(f"File not found: {file_path}")

        # Project
        project_graph(session)

        # Analyze
        analyze_data(session)

if __name__ == "__main__":
    main()
