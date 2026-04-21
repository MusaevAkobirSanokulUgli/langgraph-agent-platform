import asyncio
import tempfile
from pathlib import Path
from langchain_core.tools import tool


@tool
async def execute_python(code: str) -> str:
    """Execute Python code in a sandboxed environment."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write(code)
        f.flush()
        try:
            proc = await asyncio.create_subprocess_exec(
                "python3",
                f.name,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=10)
            result = stdout.decode() if stdout else ""
            error = stderr.decode() if stderr else ""
            return result if not error else f"Output: {result}\nError: {error}"
        except asyncio.TimeoutError:
            return "Error: Code execution timed out (10s limit)"
        finally:
            Path(f.name).unlink(missing_ok=True)
