import json
from datetime import datetime, timezone
from collections import defaultdict


class ConversationMemory:
    """Long-term memory for agent conversations."""

    def __init__(self, max_entries: int = 100):
        self._store: dict[str, list[dict]] = defaultdict(list)
        self._max_entries = max_entries

    def add(
        self, workflow_id: str, key: str, value: str, metadata: dict | None = None
    ) -> None:
        entry = {
            "key": key,
            "value": value,
            "metadata": metadata or {},
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        self._store[workflow_id].append(entry)
        if len(self._store[workflow_id]) > self._max_entries:
            self._store[workflow_id] = self._store[workflow_id][-self._max_entries :]

    def search(self, workflow_id: str, query: str, limit: int = 5) -> list[dict]:
        entries = self._store.get(workflow_id, [])
        # Simple keyword matching - production would use embeddings
        scored = []
        query_words = set(query.lower().split())
        for entry in entries:
            text = f"{entry['key']} {entry['value']}".lower()
            score = len(query_words & set(text.split()))
            if score > 0:
                scored.append((score, entry))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [e for _, e in scored[:limit]]

    def get_history(self, workflow_id: str, limit: int = 20) -> list[dict]:
        return self._store.get(workflow_id, [])[-limit:]

    def clear(self, workflow_id: str) -> None:
        self._store.pop(workflow_id, None)
