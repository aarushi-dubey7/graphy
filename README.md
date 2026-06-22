# Graphy

Graphy is now a deterministic math concept explorer with a split frontend/backend architecture that can also be served as one dynamic site.

## Phase 1 domains

- Trigonometry
- 2D vectors

## Repo layout

- [`/Users/family/Documents/graphy/mathanimate`](/Users/family/Documents/graphy/mathanimate) — Vite + React + TypeScript frontend
- [`/Users/family/Documents/graphy/backend`](/Users/family/Documents/graphy/backend) — FastAPI + SymPy lesson service

## Run locally

Backend API only:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd mathanimate
npm install
npm run dev
```

Optional frontend env:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Dynamic site mode:

```bash
cd mathanimate
npm install
npm run build

cd ../backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Then open `http://127.0.0.1:8000/`.

## Validation

- Frontend: `npm run lint && npm run test && npm run build`
- Backend: `source .venv/bin/activate && pytest`
