from __future__ import annotations

import math

import sympy as sp

from .explanation_renderer import vector_explanations
from .intent_parser import ParsedIntent
from .models import ExplanationViewSpec, GraphicalViewSpec, LessonControlSpec, LessonSpec, LessonStep, LessonSummaryMetric, LessonViews, NumericalViewSpec, VectorSample


def _round(value: float) -> float:
    return round(value, 4)


def _magnitude(vector: tuple[float, float]) -> float:
    x, y = vector
    return math.sqrt(x ** 2 + y ** 2)


def _vector_table(vector_a: tuple[float, float], vector_b: tuple[float, float], scalar: float) -> list[VectorSample]:
    resultant = (vector_a[0] + vector_b[0], vector_a[1] + vector_b[1])
    scaled = (vector_a[0] * scalar, vector_a[1] * scalar)
    return [
        VectorSample(label="Vector A", x=vector_a[0], y=vector_a[1], magnitude=_round(_magnitude(vector_a))),
        VectorSample(label="Vector B", x=vector_b[0], y=vector_b[1], magnitude=_round(_magnitude(vector_b))),
        VectorSample(label="A + B", x=resultant[0], y=resultant[1], magnitude=_round(_magnitude(resultant))),
        VectorSample(label=f"{scalar} × A", x=scaled[0], y=scaled[1], magnitude=_round(_magnitude(scaled))),
    ]


def build_vector_lesson(intent: ParsedIntent) -> LessonSpec:
    vector_a = intent.vector_a or (2.0, 1.0)
    vector_b = intent.vector_b or (1.0, 3.0)
    scalar = 2.0
    resultant = (vector_a[0] + vector_b[0], vector_a[1] + vector_b[1])
    dot_product = float(sp.Matrix(vector_a).dot(sp.Matrix(vector_b)))
    projection_length = dot_product / (_magnitude(vector_b) or 1)

    return LessonSpec(
        topic="vector2d",
        title="Exploring 2D vectors through geometry and arithmetic",
        summary="Work with vector addition, scaling, and alignment in a single coordinated plane.",
        concepts=["components", "parallelogram", "magnitude", "projection"],
        controls=LessonControlSpec(vectorA=vector_a, vectorB=vector_b, scalar=scalar),
        views=LessonViews(
            graphical=GraphicalViewSpec(
                kind="vector2d",
                title="Vector plane with addition and projection",
                vectorA=vector_a,
                vectorB=vector_b,
                resultant=resultant,
                projection=(projection_length, 0.0),
            ),
            numerical=NumericalViewSpec(
                title="Component values and magnitudes",
                metrics=[
                    LessonSummaryMetric(label="A magnitude", value=str(_round(_magnitude(vector_a)))),
                    LessonSummaryMetric(label="B magnitude", value=str(_round(_magnitude(vector_b)))),
                    LessonSummaryMetric(label="A · B", value=str(_round(dot_product))),
                    LessonSummaryMetric(label="Resultant", value=f"[{resultant[0]}, {resultant[1]}]"),
                ],
                vectorTable=_vector_table(vector_a, vector_b, scalar),
            ),
            explanation=ExplanationViewSpec(
                title="Why the vector operations work",
                blocks=vector_explanations(vector_a, vector_b, resultant, scalar, _round(dot_product)),
            ),
        ),
        steps=[
            LessonStep(id="components", title="Read components", detail="Break each vector into x and y moves.", focus=["components", "basis"]),
            LessonStep(id="addition", title="Add geometrically", detail="Use the parallelogram or head-to-tail rule.", focus=["addition", "resultant"]),
            LessonStep(id="projection", title="Compare alignment", detail="Interpret the dot product as directional agreement.", focus=["projection", "dot product"]),
        ],
    )
