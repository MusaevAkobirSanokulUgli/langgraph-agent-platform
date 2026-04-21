from app.agents.tools.calculator import calculator, _safe_eval
from app.agents.memory import ConversationMemory
import ast


def test_calculator():
    result = calculator.invoke("2 + 3")
    assert "5" in result


def test_calculator_complex():
    result = calculator.invoke("10 * 5 + 3")
    assert "53" in result


def test_memory_add_and_search():
    memory = ConversationMemory()
    memory.add("wf1", "topic", "machine learning algorithms")
    memory.add("wf1", "finding", "neural networks are effective for image classification")

    results = memory.search("wf1", "machine learning")
    assert len(results) > 0


def test_memory_history():
    memory = ConversationMemory()
    memory.add("wf1", "step1", "research")
    memory.add("wf1", "step2", "analysis")

    history = memory.get_history("wf1")
    assert len(history) == 2


def test_memory_clear():
    memory = ConversationMemory()
    memory.add("wf1", "key", "value")
    memory.clear("wf1")
    assert memory.get_history("wf1") == []
