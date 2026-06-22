from __future__ import annotations

from .models import ExplanationBlock


def trig_explanations(function_name: str, angle_degrees: float, sin_value: float, cos_value: float, tan_value: str) -> list[ExplanationBlock]:
    return [
        ExplanationBlock(
            title="Projection",
            body=(
                f"At {angle_degrees:.0f}°, the unit-circle point is ({cos_value}, {sin_value}). "
                f"The sine value is the vertical projection, the cosine value is the horizontal projection, "
                f"and tan(θ) = {tan_value} tracks slope when cosine stays away from zero."
            ),
        ),
        ExplanationBlock(
            title="Function relationship",
            body=(
                f"The {function_name} graph records one coordinate of the rotating point as the angle changes. "
                "That is why circular motion and wave motion stay synchronized."
            ),
        ),
        ExplanationBlock(
            title="Periodicity",
            body=(
                "A full rotation repeats every 360° or 2π radians, so the graph cycles through the same values with a fixed rhythm."
            ),
        ),
    ]


def vector_explanations(vector_a: tuple[float, float], vector_b: tuple[float, float], resultant: tuple[float, float], scalar: float, dot_product: float) -> list[ExplanationBlock]:
    return [
        ExplanationBlock(
            title="Addition",
            body=(
                f"Vector A = [{vector_a[0]}, {vector_a[1]}] and Vector B = [{vector_b[0]}, {vector_b[1]}]. "
                f"Placing B at the head of A gives the resultant [{resultant[0]}, {resultant[1]}]."
            ),
        ),
        ExplanationBlock(
            title="Scaling",
            body=(
                f"Scaling A by {scalar} multiplies each component independently, which stretches or flips the vector without changing its direction rules."
            ),
        ),
        ExplanationBlock(
            title="Projection and alignment",
            body=(
                f"The dot product A · B = {dot_product} measures how strongly the vectors align. Larger positive values mean they point in similar directions."
            ),
        ),
    ]
