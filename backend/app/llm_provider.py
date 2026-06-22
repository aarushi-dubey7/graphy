from __future__ import annotations

from .models import LessonSpec


class LLMProvider:
    def rewrite_lesson(self, lesson: LessonSpec) -> LessonSpec:
        return lesson


provider = LLMProvider()
