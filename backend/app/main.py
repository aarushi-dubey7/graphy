from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from .intent_parser import parse_intent
from .llm_provider import provider
from .models import LessonRequest, LessonSpec
from .trig_generator import build_trig_lesson
from .vector2d_generator import build_vector_lesson

app = FastAPI(title="Graphy API", version="0.1.0")
FRONTEND_DIST = Path(__file__).resolve().parents[2] / "mathanimate" / "dist"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/explore", response_model=LessonSpec)
def explore(request: LessonRequest) -> LessonSpec:
    if not request.input.strip():
        raise HTTPException(status_code=400, detail="Input is required.")

    intent = parse_intent(request.topic, request.input)
    lesson = build_trig_lesson(intent) if request.topic == "trig" else build_vector_lesson(intent)
    return provider.rewrite_lesson(lesson)


if FRONTEND_DIST.exists():
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")


@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    if full_path.startswith("api/"):
        return JSONResponse(status_code=404, content={"detail": "Not found"})

    index_file = FRONTEND_DIST / "index.html"
    requested_file = FRONTEND_DIST / full_path if full_path else index_file

    if requested_file.exists() and requested_file.is_file():
        return FileResponse(requested_file)

    if index_file.exists():
        return FileResponse(index_file)

    return JSONResponse(
        status_code=503,
        content={
            "detail": "Frontend build not found. Run `npm run build` in `mathanimate` before serving the dynamic site.",
        },
    )
