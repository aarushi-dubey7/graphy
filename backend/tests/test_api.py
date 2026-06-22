from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_trig_lesson_shape():
    response = client.post("/api/explore", json={"topic": "trig", "input": "show sine on the unit circle"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["topic"] == "trig"
    assert payload["views"]["graphical"]["kind"] == "trig"
    assert payload["views"]["numerical"]["trigTable"]
    assert payload["steps"][0]["title"] == "Set the angle"


def test_vector_lesson_uses_input_vectors():
    response = client.post("/api/explore", json={"topic": "vector2d", "input": "add [3,4] and [1,-2]"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["controls"]["vectorA"] == [3.0, 4.0]
    assert payload["controls"]["vectorB"] == [1.0, -2.0]
    assert payload["views"]["graphical"]["resultant"] == [4.0, 2.0]
