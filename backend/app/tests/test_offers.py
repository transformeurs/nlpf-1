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


# Create a company
# Login
# Create an offer
def test_create_offer():
    response = client.post(
        "/companies",
        json={
            "name": "Test Company",
            "email": "test@company.com",
            "password": "earnalotofmoney",
            "photo_url": "https://example.com/photo.jpg",
            "description": "I am a test company",
        },
    )
    assert response.status_code == 200, response.text

    response = client.post(
        "/account/login",
        json={
            "email": "test@company.com",
            "password": "earnalotofmoney",
        }
    )

    assert response.status_code == 200, response.text
    data = response.json()
    assert "access_token" in data

    response = client.post(
        "/offers",
        json={
            "title": "frontend developer",
            "description": "developer frontend",
            "skills": ["react", "java"],
            "location": "Paris",
            "salary": 42000,
            "time": "CDI"
        },
        headers={
            "Authorization": f"Bearer {data['access_token']}"
        }
    )

    assert response.status_code == 200, response.text
    data = response.json()
    assert data["author"] == "Test Company"
    assert data["contact"] == "test@company.com"


# Create a company
# Login
# Try to delete the offer previously created
def test_try_delete_offer():
    response = client.post(
        "/companies",
        json={
            "name": "Test Company 2",
            "email": "test2@company.com",
            "password": "earnalotofmoney",
        }
    )
    assert response.status_code == 200, response.text

    response = client.post(
        "/account/login",
        json={
            "email": "test2@company.com",
            "password": "earnalotofmoney",
        }
    )

    assert response.status_code == 200, response.text
    data = response.json()
    assert "access_token" in data

    response = client.delete(
        "/offers/1",
        headers={
            "Authorization": f"Bearer {data['access_token']}"
        }
    )

    # Should be forbidden
    assert response.status_code == 403, response.text
