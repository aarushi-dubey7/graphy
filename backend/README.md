# Graphy Backend

Run locally:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API:

- `GET /api/health`
- `POST /api/explore`

Dynamic site:

1. Build the frontend from `../mathanimate` with `npm run build`
2. Start FastAPI as above
3. Open `http://127.0.0.1:8000/`

The backend serves the built SPA and the API from the same origin.
