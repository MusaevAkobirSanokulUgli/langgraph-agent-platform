import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_list_agents(client: AsyncClient):
    response = await client.get("/api/v1/agents/")
    assert response.status_code == 200
    agents = response.json()
    assert len(agents) == 4


@pytest.mark.asyncio
async def test_list_workflows_empty(client: AsyncClient):
    response = await client.get("/api/v1/workflows/")
    assert response.status_code == 200
