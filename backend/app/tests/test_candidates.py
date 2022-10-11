import os
import uuid

from dotenv import load_dotenv
load_dotenv(".env.local")

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ..database import Base
from ..dependencies import get_db
from ..main import app

# Setup Test Database

SQLALCHEMY_DATABASE_URL = os.getenv("TEST_DATABASE_URL") or "postgresql://jobboard:jobboard@localhost:5432"
NEW_DB_NAME = 'jobboard_test_' + str(uuid.uuid4()).replace('-', '_')

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)

with engine.connect() as conn:
    conn.execute("commit")
    # Do not substitute user-supplied database names here.
    conn.execute(f"CREATE DATABASE {NEW_DB_NAME}")

# Connect to newly created test database

engine = create_engine(
    SQLALCHEMY_DATABASE_URL + '/' + NEW_DB_NAME
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


# Create a candidate
# Get information on the candidate after its creation
def test_create_candidate():
    response = client.post(
        "/candidates",
        json={
            "name": "Test Candidate",
            "email": "test@example.com",
            "password": "chimichangas4life",
            "photo_url": "https://example.com/photo.jpg",
            "description": "I am a test candidate",
            "pronouns": "she/her",
        },
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    user_id = data["id"]

    response = client.get(f"/candidates/{user_id}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["id"] == user_id


# Login with the candidate previously created
# Assert it is connected and the token is valid by calling /candidates/me/
def test_login_candidate():
    response = client.post(
        "/account/login",
        json={
            "email": "test@example.com",
            "password": "chimichangas4life",
        }
    )

    assert response.status_code == 200, response.text
    data = response.json()
    assert "access_token" in data

    response = client.get("/candidates/me/", headers={"Authorization": f"Bearer {data['access_token']}"})
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == "test@example.com"
