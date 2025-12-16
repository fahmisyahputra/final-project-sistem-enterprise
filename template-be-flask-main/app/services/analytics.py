from neo4j import Session
from typing import List, Dict, Any

class AnalyticsService:
    def __init__(self, session: Session):
        self.session = session

    def get_organization_evolution(self, start_month: str, end_month: str) -> Dict[str, Any]:
        query = """
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
        """
        result = self.session.run(query, start_month=start_month, end_month=end_month)
        record = result.single()
        if record:
            stats = record["stats"]
            return {
                "phase": f"{start_month} to {end_month}",
                "active_users": stats["active_users"],
                "active_roles": stats["active_roles"],
                "total_interactions": stats["total_interactions"] or 0,
                "top_roles": []
            }
        return {}

    def get_organization_evolution_trend(self, start_month: str, end_month: str) -> List[Dict[str, Any]]:
        query_users = """
        MATCH (p:Person)-[w:WORKED_ON]->(c:Case)
        WHERE w.month >= $start_month AND w.month <= $end_month
        WITH w.month as month, count(DISTINCT p) as active_users, count(DISTINCT p.role) as active_roles
        RETURN month, active_users, active_roles
        ORDER BY month
        """
        
        query_interactions = """
        MATCH (p1:Person)-[r:COLLABORATED_IN]-(p2:Person)
        WHERE r.month >= $start_month AND r.month <= $end_month
        WITH r.month as month, sum(r.weight) as total_interactions
        RETURN month, total_interactions
        ORDER BY month
        """
        
        users_result = self.session.run(query_users, start_month=start_month, end_month=end_month)
        interactions_result = self.session.run(query_interactions, start_month=start_month, end_month=end_month)
        
        data_map = {}
        
        for record in users_result:
            month = record["month"]
            data_map[month] = {
                "phase": month,
                "active_users": record["active_users"],
                "active_roles": record["active_roles"],
                "total_interactions": 0,
                "top_roles": []
            }
            
        for record in interactions_result:
            month = record["month"]
            if month not in data_map:
                data_map[month] = {
                    "phase": month,
                    "active_users": 0,
                    "active_roles": 0,
                    "total_interactions": 0,
                    "top_roles": []
                }
            data_map[month]["total_interactions"] = record["total_interactions"]
            
        # Convert to list and sort
        return sorted(data_map.values(), key=lambda x: x["phase"])

    def get_role_interactions(self) -> List[Dict[str, Any]]:
        query = """
        MATCH (r1:Role)-[i:INTERACTS_WITH]->(r2:Role)
        RETURN r1.name as role_a, r2.name as role_b, i.total_weight as weight
        ORDER BY weight DESC
        """
        result = self.session.run(query)
        return [
            {"role_a": record["role_a"], "role_b": record["role_b"], "weight": record["weight"]}
            for record in result
        ]

    def get_top_interactions(self, limit: int = 10) -> List[Dict[str, Any]]:
        query = """
        MATCH (r1:Role)-[i:INTERACTS_WITH]->(r2:Role)
        RETURN r1.name as role_a, r2.name as role_b, i.total_weight as weight
        ORDER BY weight DESC
        LIMIT $limit
        """
        result = self.session.run(query, limit=limit)
        return [
            {"role_a": record["role_a"], "role_b": record["role_b"], "weight": record["weight"]}
            for record in result
        ]

    def get_user_collaboration(self, month: str) -> List[Dict[str, Any]]:
        query = """
        MATCH (p1:Person)-[r:COLLABORATED_IN]-(p2:Person)
        WHERE r.month = $month
        RETURN p1.name as user_a, p1.role as role_a, p2.name as user_b, p2.role as role_b, r.weight as weight
        ORDER BY weight DESC
        """
        result = self.session.run(query, month=month)
        return [
            {
                "user_a": record["user_a"], 
                "role_a": record["role_a"],
                "user_b": record["user_b"], 
                "role_b": record["role_b"],
                "weight": record["weight"], 
                "month": month
            }
            for record in result
        ]

    def get_bpmn_data(self) -> Dict[str, Any]:
        query_nodes = "MATCH (r:Role) RETURN r.name as id, 'Role' as type"
        query_edges = """
        MATCH (r1:Role)-[i:INTERACTS_WITH]->(r2:Role)
        RETURN r1.name as source, r2.name as target, i.total_weight as weight
        """
        
        nodes_result = self.session.run(query_nodes)
        edges_result = self.session.run(query_edges)
        
        nodes = [{"id": r["id"], "label": r["id"], "type": r["type"]} for r in nodes_result]
        edges = [{"source": r["source"], "target": r["target"], "label": str(r["weight"]), "weight": r["weight"]} for r in edges_result]
        
        return {"nodes": nodes, "edges": edges}

    def get_monthly_interactions(self, year: str = None) -> List[Dict[str, Any]]:
        if year:
            query = """
            MATCH (p1:Person)-[r:COLLABORATED_IN]-(p2:Person)
            WHERE r.month STARTS WITH $year
            RETURN r.month as month, sum(r.weight) as total_interactions
            ORDER BY month
            """
            result = self.session.run(query, year=year)
        else:
            query = """
            MATCH (p1:Person)-[r:COLLABORATED_IN]-(p2:Person)
            RETURN r.month as month, sum(r.weight) as total_interactions
            ORDER BY month
            """
            result = self.session.run(query)
            
        return [
            {"month": record["month"], "total_interactions": record["total_interactions"]}
            for record in result
        ]

    def get_all_roles(self) -> List[Dict[str, str]]:
        query = "MATCH (r:Role) RETURN r.name as name ORDER BY name"
        result = self.session.run(query)
        return [{"name": record["name"]} for record in result]

    def get_all_users(self) -> List[Dict[str, str]]:
        query = "MATCH (p:Person) RETURN p.name as name ORDER BY name"
        result = self.session.run(query)
        return [{"name": record["name"]} for record in result]

    def get_overtime_risk(self) -> List[Dict[str, Any]]:
        query = """
        MATCH (p:Person)-[w:WORKED_ON]->(c:Case)
        WHERE w.timestamp.hour < 7 OR w.timestamp.hour > 18
        RETURN p.name as name, p.role as role, count(w) as overtime_count
        ORDER BY overtime_count DESC
        LIMIT 5
        """
        result = self.session.run(query)
        return [
            {"name": record["name"], "role": record["role"], "overtime_count": record["overtime_count"]}
            for record in result
        ]

    def get_project_durations(self) -> List[Dict[str, Any]]:
        query = """
        MATCH (p:Person)-[w:WORKED_ON]->(c:Case)
        WITH c, min(w.timestamp) as start_time, max(w.timestamp) as end_time
        WITH c, duration.between(start_time, end_time).days as duration_days
        RETURN c.id as case_id, duration_days
        ORDER BY duration_days DESC
        LIMIT 10
        """
        result = self.session.run(query)
        return [
            {"case_id": record["case_id"], "duration_days": record["duration_days"]}
            for record in result
        ]

    def get_average_project_duration(self) -> float:
        query = """
        MATCH (p:Person)-[w:WORKED_ON]->(c:Case)
        WITH c, min(w.timestamp) as start_time, max(w.timestamp) as end_time
        WITH duration.between(start_time, end_time).days as duration_days
        RETURN avg(duration_days) as avg_duration
        """
        result = self.session.run(query)
        record = result.single()
        return round(record["avg_duration"], 1) if record and record["avg_duration"] else 0.0

    def get_handover_flow(self) -> List[Dict[str, Any]]:
        query = """
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
        """
        result = self.session.run(query)
        return [
            {"source_role": record["source_role"], "target_role": record["target_role"], "avg_duration": round(record["avg_duration"], 1)}
            for record in result
        ]

    def get_resource_utilization(self) -> List[Dict[str, Any]]:
        query = """
        MATCH (p:Person)-[w:WORKED_ON]->(c:Case)
        RETURN w.timestamp.dayOfWeek as day, w.timestamp.hour as hour, count(*) as count
        ORDER BY day, hour
        """
        result = self.session.run(query)
        return [
            {"day": record["day"], "hour": record["hour"], "count": record["count"]}
            for record in result
        ]
