from langchain_core.tools import tool


@tool
def web_search(query: str) -> str:
    """Search the web for information on a given query."""
    # In production, this would use Tavily, Serper, or similar
    return (
        f"Search results for: {query}\n"
        "[Simulated results - integrate with Tavily API for production]"
    )
