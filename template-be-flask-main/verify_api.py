import httpx
import asyncio

BASE_URL = "http://localhost:8000"

async def test_endpoints():
    async with httpx.AsyncClient() as client:
        print("Testing API Endpoints...")
        
        # 1. Root
        try:
            resp = await client.get(f"{BASE_URL}/")
            print(f"GET /: {resp.status_code}")
        except Exception as e:
            print(f"Failed to connect to {BASE_URL}. Is the server running?")
            return

        # 2. Organization Evolution
        resp = await client.get(f"{BASE_URL}/organization/evolution", params={"start_month": "2024-01", "end_month": "2024-03"})
        print(f"GET /organization/evolution: {resp.status_code}")
        if resp.status_code == 200:
            print(f"  -> {resp.json()}")

        # 3. Role Interactions
        resp = await client.get(f"{BASE_URL}/roles/interactions")
        print(f"GET /roles/interactions: {resp.status_code}")
        
        # 4. Top Interactions
        resp = await client.get(f"{BASE_URL}/roles/top-interactions", params={"limit": 5})
        print(f"GET /roles/top-interactions: {resp.status_code}")
        if resp.status_code == 200:
            print(f"  -> {resp.json()[:2]} ...")

        # 5. User Collaboration
        resp = await client.get(f"{BASE_URL}/users/collaboration", params={"month": "2024-04"})
        print(f"GET /users/collaboration: {resp.status_code}")
        if resp.status_code == 200:
            print(f"  -> {resp.json()[:2]} ...")

        # 6. BPMN Data
        resp = await client.get(f"{BASE_URL}/bpmn/data")
        print(f"GET /bpmn/data: {resp.status_code}")

if __name__ == "__main__":
    asyncio.run(test_endpoints())
