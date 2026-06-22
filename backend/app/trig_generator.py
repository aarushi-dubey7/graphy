from __future__ import annotations

import math

from .explanation_renderer import trig_explanations
from .intent_parser import ParsedIntent
from .models import ExplanationViewSpec, GraphicalViewSpec, LessonControlSpec, LessonSpec, LessonStep, LessonSummaryMetric, LessonViews, NumericalViewSpec, TrigPoint


def _round(value: float) -> float:
    return round(value, 4)


def _format_tan(value: float) -> str:
    if not math.isfinite(value) or abs(value) > 9999:
        return "undefined"
    return str(_round(value))


def _trig_table(angle_degrees: float) -> list[TrigPoint]:
    angles = sorted(set([-90, -45, 0, 30, 45, 60, 90, int(round(angle_degrees))]))
    rows: list[TrigPoint] = []
    for degrees in angles:
        radians = math.radians(degrees)
        rows.append(
            TrigPoint(
                angleDegrees=degrees,
                radians=_round(radians),
                sin=_round(math.sin(radians)),
                cos=_round(math.cos(radians)),
                tan=_format_tan(math.tan(radians)),
            )
        )
    return rows


def build_trig_lesson(intent: ParsedIntent) -> LessonSpec:
    angle_degrees = 45.0
    radians = math.radians(angle_degrees)
    sin_value = _round(math.sin(radians))
    cos_value = _round(math.cos(radians))
    tan_value = _format_tan(math.tan(radians))
    function_name = intent.function_name or "sin"

    return LessonSpec(
        topic="trig",
        title=f"Understanding {function_name} through the unit circle",
        summary="Connect circular motion, coordinate projections, and wave behavior in one synchronized trig lesson.",
        concepts=["unit circle", "projection", "periodicity", "wave graph"],
        controls=LessonControlSpec(angleDegrees=angle_degrees),
        views=LessonViews(
            graphical=GraphicalViewSpec(
                kind="trig",
                title="Unit circle and linked wave",
                angleDegrees=angle_degrees,
                trigFunction=function_name,
            ),
            numerical=NumericalViewSpec(
                title="Angle values and samples",
                metrics=[
                    LessonSummaryMetric(label="Angle", value="45°"),
                    LessonSummaryMetric(label="Radians", value=str(_round(radians))),
                    LessonSummaryMetric(label="sin(θ)", value=str(sin_value)),
                    LessonSummaryMetric(label="cos(θ)", value=str(cos_value)),
                    LessonSummaryMetric(label="tan(θ)", value=tan_value),
                ],
                trigTable=_trig_table(angle_degrees),
            ),
            explanation=ExplanationViewSpec(
                title="Why the views agree",
                blocks=trig_explanations(function_name, angle_degrees, sin_value, cos_value, tan_value),
            ),
        ),
        steps=[
            LessonStep(id="angle", title="Set the angle", detail="Start with the rotating radius on the unit circle.", focus=["angle", "circle"]),
            LessonStep(id="projection", title="Read the projections", detail="Track horizontal and vertical coordinates.", focus=["projection", "coordinates"]),
            LessonStep(id="graph", title="Link to the wave", detail="See how the circle output becomes the trig graph.", focus=["wave", "periodicity"]),
        ],
    )
