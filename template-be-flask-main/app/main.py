from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.neo4j import neo4j_driver
from app.routers import organization, roles, users, bpmn

app = FastAPI(
    title="Organizational Mining API",
    description="API for analyzing organizational structures from process data",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Verify connection
    try:
        with neo4j_driver.get_session() as session:
            session.run("RETURN 1")
        print("Connected to Neo4j")
    except Exception as e:
        print(f"Failed to connect to Neo4j: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    neo4j_driver.close()

app.include_router(organization.router)
app.include_router(roles.router)
app.include_router(users.router)
app.include_router(bpmn.router)

@app.get("/")
async def root():
    return {"message": "Organizational Mining API is running"}
