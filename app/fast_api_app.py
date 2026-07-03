# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import contextlib
import os
from collections.abc import AsyncIterator

import google.auth
from a2a.server.tasks import InMemoryTaskStore
from dotenv import load_dotenv
from fastapi import FastAPI
from google.adk.cli.fast_api import get_fast_api_app
from google.adk.runners import Runner
from google.cloud import logging as google_cloud_logging

from app.app_utils import services
from app.app_utils.a2a import attach_a2a_routes
from app.app_utils.telemetry import setup_telemetry
from app.app_utils.typing import Feedback

load_dotenv()
setup_telemetry()
_, project_id = google.auth.default()
logging_client = google_cloud_logging.Client()
logger = logging_client.logger(__name__)
allow_origins = ["http://localhost:4000", "http://127.0.0.1:4000"]

AGENT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    from app.agent import app as adk_app
    from app.agent import root_agent

    runner = Runner(
        app=adk_app,
        session_service=services.get_session_service(),
        artifact_service=services.get_artifact_service(),
        auto_create_session=True,
    )
    app.state.runner = runner
    app.state.agent_app_name = adk_app.name
    await attach_a2a_routes(
        app,
        agent=root_agent,
        runner=runner,
        task_store=InMemoryTaskStore(),
        rpc_path=f"/a2a/{adk_app.name}",
    )
    yield


app: FastAPI = get_fast_api_app(
    agents_dir=AGENT_DIR,
    web=True,
    artifact_service_uri=services.ARTIFACT_SERVICE_URI,
    allow_origins=allow_origins,
    session_service_uri=services.SESSION_SERVICE_URI,
    otel_to_cloud=False,
    lifespan=lifespan,
)
app.title = "email-triage-agent"
app.description = "API for interacting with the Agent email-triage-agent"


@app.post("/feedback")
def collect_feedback(feedback: Feedback) -> dict[str, str]:
    """Collect and log feedback.

    Args:
        feedback: The feedback data to log

    Returns:
        Success message
    """
    logger.log_struct(feedback.model_dump(), severity="INFO")
    return {"status": "success"}


from pydantic import BaseModel
from google.genai import types

class TriageRequest(BaseModel):
    email: str

@app.post("/api/triage")
async def api_triage(req: TriageRequest):
    runner = app.state.runner
    content = types.Content(role="user", parts=[types.Part.from_text(text=req.email)])
    
    triage_result = None
    action_text = ""
    
    import uuid
    session_id = uuid.uuid4().hex
    
    try:
        # Run the workflow async
        async for event in runner.run_async(user_id="frontend", session_id=session_id, new_message=content):
            if event.node_name == "prioritizer" and event.output:
                triage_result = event.output
            elif event.node_name.startswith("handle_") and event.output:
                action_text = event.output
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"AI Model Error: {str(e)}"}
            
    if not triage_result:
        return {"error": "Failed to triage email"}
        
    # Extract properties (handling both Pydantic models or dicts)
    def get_val(obj, key, default):
        if hasattr(obj, key):
            return getattr(obj, key)
        if isinstance(obj, dict):
            return obj.get(key, default)
        return default

    return {
        "department": get_val(triage_result, "department", ""),
        "severity": get_val(triage_result, "severity", ""),
        "priority_score": get_val(triage_result, "priority_score", 0),
        "sentiment": get_val(triage_result, "sentiment", ""),
        "is_escalation": get_val(triage_result, "is_escalation", False),
        "churn_risk": get_val(triage_result, "churn_risk", False),
        "action_items": get_val(triage_result, "action_items", []),
        "suggested_draft_response": get_val(triage_result, "suggested_draft_response", ""),
        "action": action_text
    }



from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000", "http://127.0.0.1:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Main execution
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
