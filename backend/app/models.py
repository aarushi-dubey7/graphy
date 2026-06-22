from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


Topic = Literal["trig", "vector2d"]


class LessonRequest(BaseModel):
    topic: Topic
    input: str = Field(min_length=1)
    viewPrefs: list[str] | None = None


class LessonSummaryMetric(BaseModel):
    label: str
    value: str


class ExplanationBlock(BaseModel):
    title: str
    body: str


class LessonStep(BaseModel):
    id: str
    title: str
    detail: str
    focus: list[str]


class TrigPoint(BaseModel):
    angleDegrees: int
    radians: float
    sin: float
    cos: float
    tan: str


class VectorSample(BaseModel):
    label: str
    x: float
    y: float
    magnitude: float


class GraphicalViewSpec(BaseModel):
    kind: Topic
    title: str
    angleDegrees: float | None = None
    trigFunction: Literal["sin", "cos", "tan"] | None = None
    vectorA: tuple[float, float] | None = None
    vectorB: tuple[float, float] | None = None
    resultant: tuple[float, float] | None = None
    projection: tuple[float, float] | None = None


class NumericalViewSpec(BaseModel):
    title: str
    metrics: list[LessonSummaryMetric]
    trigTable: list[TrigPoint] | None = None
    vectorTable: list[VectorSample] | None = None


class ExplanationViewSpec(BaseModel):
    title: str
    blocks: list[ExplanationBlock]


class LessonViews(BaseModel):
    graphical: GraphicalViewSpec
    numerical: NumericalViewSpec
    explanation: ExplanationViewSpec


class LessonControlSpec(BaseModel):
    angleDegrees: float | None = None
    vectorA: tuple[float, float] | None = None
    vectorB: tuple[float, float] | None = None
    scalar: float | None = None


class LessonSpec(BaseModel):
    topic: Topic
    title: str
    summary: str
    concepts: list[str]
    controls: LessonControlSpec
    views: LessonViews
    steps: list[LessonStep]
