import pytest
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


# This fixture setups a test client at the module scope (test file) with its own
# empty database.
@pytest.fixture(scope="module")
def test_client() -> TestClient:
    SQLALCHEMY_DATABASE_URL = os.getenv("TEST_DATABASE_URL") or "postgresql://jobboard:jobboard@localhost:5432"
    NEW_DB_NAME = 'jobboard_test_' + str(uuid.uuid4()).replace('-', '_')

    # Create a new database
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL
    )
    with engine.connect() as conn:
        conn.execute("commit")
        conn.execute(f"CREATE DATABASE {NEW_DB_NAME}")

    # Connect to newly created test database
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL + '/' + NEW_DB_NAME
    )

    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    # Override get_db dependency
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    # Create a test client using the FastAPI test client
    with TestClient(app) as client:
        yield client
