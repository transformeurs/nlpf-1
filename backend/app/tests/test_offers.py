from fastapi.testclient import TestClient

# Create a company
# Login
# Create an offer
def test_create_offer(test_client: TestClient):
    response = test_client.post(
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

    response = test_client.post(
        "/account/login",
        json={
            "email": "test@company.com",
            "password": "earnalotofmoney",
        }
    )

    assert response.status_code == 200, response.text
    data = response.json()
    assert "access_token" in data

    response = test_client.post(
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
def test_try_delete_offer(test_client: TestClient):
    response = test_client.post(
        "/companies",
        json={
            "name": "Test Company 2",
            "email": "test2@company.com",
            "password": "earnalotofmoney",
        }
    )
    assert response.status_code == 200, response.text

    response = test_client.post(
        "/account/login",
        json={
            "email": "test2@company.com",
            "password": "earnalotofmoney",
        }
    )

    assert response.status_code == 200, response.text
    data = response.json()
    assert "access_token" in data

    response = test_client.delete(
        "/offers/1",
        headers={
            "Authorization": f"Bearer {data['access_token']}"
        }
    )

    # Should be forbidden
    assert response.status_code == 403, response.text
