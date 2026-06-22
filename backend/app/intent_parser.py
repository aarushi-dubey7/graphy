from __future__ import annotations

import re
from dataclasses import dataclass

from .models import Topic


@dataclass
class ParsedIntent:
    topic: Topic
    canonical_input: str
    function_name: str | None = None
    vector_a: tuple[float, float] | None = None
    vector_b: tuple[float, float] | None = None


VECTOR_PATTERN = re.compile(r"\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]")


def parse_intent(topic: Topic, raw_input: str) -> ParsedIntent:
    normalized = " ".join(raw_input.lower().split())
    if topic == "trig":
        if "cos" in normalized:
            function_name = "cos"
        elif "tan" in normalized:
            function_name = "tan"
        else:
            function_name = "sin"
        return ParsedIntent(topic=topic, canonical_input=normalized, function_name=function_name)

    matches = VECTOR_PATTERN.findall(normalized)
    vector_a = (2.0, 1.0)
    vector_b = (1.0, 3.0)
    if len(matches) >= 1:
        vector_a = (float(matches[0][0]), float(matches[0][1]))
    if len(matches) >= 2:
        vector_b = (float(matches[1][0]), float(matches[1][1]))
    return ParsedIntent(topic=topic, canonical_input=normalized, vector_a=vector_a, vector_b=vector_b)
