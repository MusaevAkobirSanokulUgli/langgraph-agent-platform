from datetime import datetime, timezone


class CheckpointService:
    """Simple in-memory checkpoint service. Production would use Redis/PostgreSQL."""

    def __init__(self):
        self._checkpoints: dict[str, dict] = {}

    async def initialize(self) -> None:
        pass

    async def save(self, thread_id: str, state: dict) -> None:
        self._checkpoints[thread_id] = {
            "state": state,
            "saved_at": datetime.now(timezone.utc).isoformat(),
        }

    async def load(self, thread_id: str) -> dict | None:
        checkpoint = self._checkpoints.get(thread_id)
        return checkpoint["state"] if checkpoint else None

    async def delete(self, thread_id: str) -> None:
        self._checkpoints.pop(thread_id, None)

    async def list_checkpoints(self) -> list[str]:
        return list(self._checkpoints.keys())

    async def close(self) -> None:
        self._checkpoints.clear()
