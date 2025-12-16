import csv
import os
from datetime import datetime
from neo4j import Session

class DataImporter:
    def __init__(self, session: Session):
        self.session = session

    def parse_timestamp(self, ts_str):
        # Format: 4-24-19 15:00 (MM-DD-YY HH:MM)
        try:
            dt = datetime.strptime(ts_str, "%m-%d-%y %H:%M")
            return dt.isoformat(), dt.strftime("%Y-%m")
        except ValueError:
            return None, None

    def clear_database(self):
        self.session.run("MATCH (n) DETACH DELETE n")

    def load_csv(self, file_path: str):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        count = 0
        with open(file_path, 'r') as f:
            reader = csv.DictReader(f, delimiter=';')
            for row in reader:
                if not row['CaseID'] or not row['timestamp'] or not row['Resource']:
                    continue

                iso_time, month = self.parse_timestamp(row['timestamp'])
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
                self.session.run(query, 
                            resource=row['Resource'],
                            role=row['Role'],
                            case_id=row['CaseID'],
                            activity=row['NameActivity'],
                            timestamp=iso_time,
                            month=month,
                            source_file=os.path.basename(file_path))
                count += 1
        return count

    def project_graph(self):

        query_collab = """
        MATCH (p1:Person)-[w1:WORKED_ON]->(c:Case)<-[w2:WORKED_ON]-(p2:Person)
        WHERE p1 <> p2 AND w1.month = w2.month
        MERGE (p1)-[r:COLLABORATED_IN {month: w1.month}]-(p2)
        ON CREATE SET r.weight = 1
        ON MATCH SET r.weight = r.weight + 1
        """
        self.session.run(query_collab)

        query_roles = """
        MATCH (p1:Person)-[r:COLLABORATED_IN]-(p2:Person)
        MATCH (r1:Role {name: p1.role})
        MATCH (r2:Role {name: p2.role})
        WHERE r1 <> r2
        MERGE (r1)-[i:INTERACTS_WITH]->(r2)
        ON CREATE SET i.total_weight = r.weight
        ON MATCH SET i.total_weight = i.total_weight + r.weight
        """
        self.session.run(query_roles)
