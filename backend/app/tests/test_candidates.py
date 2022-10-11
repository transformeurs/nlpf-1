from fastapi.testclient import TestClient

# Create a candidate
# Get information on the candidate after its creation
def test_create_candidate(test_client: TestClient):
    response = test_client.post(
        "/candidates",
        json={
            "name": "Test Candidate",
            "age": 25,
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

    response = test_client.get(f"/candidates/{user_id}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["id"] == user_id


# Login with the candidate previously created
# Assert it is connected and the token is valid by calling /candidates/me/
def test_login_candidate(test_client: TestClient):
    response = test_client.post(
        "/account/login",
        json={
            "email": "test@example.com",
            "password": "chimichangas4life",
        }
    )

    assert response.status_code == 200, response.text
    data = response.json()
    assert "access_token" in data

    response = test_client.get("/candidates/me/", headers={"Authorization": f"Bearer {data['access_token']}"})
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == "test@example.com"
