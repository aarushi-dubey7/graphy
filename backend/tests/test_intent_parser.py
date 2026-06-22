from app.intent_parser import parse_intent


def test_trig_defaults_to_sine():
    intent = parse_intent("trig", "show this on the unit circle")
    assert intent.function_name == "sin"


def test_trig_detects_cosine():
    intent = parse_intent("trig", "plot cos(x)")
    assert intent.function_name == "cos"


def test_vector_parser_extracts_coordinates():
    intent = parse_intent("vector2d", "add [2, 1] and [-4, 5]")
    assert intent.vector_a == (2.0, 1.0)
    assert intent.vector_b == (-4.0, 5.0)
