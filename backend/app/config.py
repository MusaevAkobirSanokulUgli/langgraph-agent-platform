from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    model_config = {"env_file": ".env", "env_prefix": "AGENT_"}

    app_name: str = "LangGraph Agent Platform"
    debug: bool = False

    openai_api_key: str = ""
    llm_model: str = "gpt-4o"
    temperature: float = 0.7

    redis_url: str = "redis://localhost:6379"
    max_agent_iterations: int = 10
    workflow_timeout: int = 300

    tavily_api_key: str = ""


settings = Settings()
