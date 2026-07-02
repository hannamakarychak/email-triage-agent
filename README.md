# AI Email Triage Agent 🚀

An autonomous AI agent built for the **Kaggle 5-Day AI Agents Intensive Course with Google**. 

This project demonstrates a graph-based workflow (ReAct agent) that automatically analyzes incoming customer support emails, calculates a priority score, determines sentiment, and routes the email to the appropriate department.

### ✨ Key Features
- **Intelligent Routing**: Uses Google Gemini (Flash) to categorize emails into departments like Finance, Sales, Technical Support, and Customer Satisfaction.
- **Priority Scoring System**: Calculates priority mathematically based on customer tier (Bronze to Platinum), issue severity, emotional sentiment, and escalation threats.
- **Enterprise Security**: 
  - **PII Redaction**: Pre-processes text using regex to scrub Credit Card numbers and SSNs before hitting the LLM.
  - **Safety Guardrails**: Configured with strict Google Cloud `HarmBlockThreshold` settings to block hate speech, harassment, and dangerous content.
  - **Prompt Injection Defense**: Explicit system-level instructions preventing malicious actors from hijacking the agent.
- **Custom Dashboard**: Includes a sleek, modern CRM-inspired frontend (`frontend/index.html`) to showcase the agent's triage capabilities with glassmorphism UI.

## Project Structure

```
email-triage-agent/
├── app/         # Core agent logic and API
├── frontend/    # Vanilla JS/CSS Dashboard UI
├── tests/       # Evaluation datasets and unit tests
└── artifacts/   # (Ignored) Trace logs and evaluation grading results
```

> 💡 **Tip:** Use [Antigravity CLI](https://antigravity.google/) for AI-assisted development - project context is pre-configured in `GEMINI.md`.

## Requirements

Before you begin, ensure you have:
- **uv**: Python package manager (used for all dependency management in this project) - [Install](https://docs.astral.sh/uv/getting-started/installation/) ([add packages](https://docs.astral.sh/uv/concepts/dependencies/) with `uv add <package>`)
- **agents-cli**: Agents CLI - Install with `uv tool install google-agents-cli`
- **Google Cloud SDK**: For GCP services - [Install](https://cloud.google.com/sdk/docs/install)


## Quick Start

Install `agents-cli` and its skills if not already installed:

```bash
uvx google-agents-cli setup
```

Install required packages:

```bash
agents-cli install
```

Test the agent with a local web server:

```bash
agents-cli playground
```

You can also use features from the [ADK](https://adk.dev/) CLI with `uv run adk`.

## Commands

| Command              | Description                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------- |
| `agents-cli install` | Install dependencies using uv                                                         |
| `agents-cli playground` | Launch local development environment                                                  |
| `agents-cli lint`    | Run code quality checks                                                               |
| `agents-cli eval`    | Evaluate agent behavior (generate, grade, analyze, and more — see `agents-cli eval --help`) |
| `uv run pytest tests/unit tests/integration` | Run unit and integration tests                                                        |
| `agents-cli deploy`  | Deploy agent to Cloud Run                                                                   || [A2A Inspector](https://github.com/a2aproject/a2a-inspector) | Launch A2A Protocol Inspector                                                        |

## 🛠️ Project Management

| Command | What It Does |
|---------|--------------|
| `agents-cli scaffold enhance` | Add CI/CD pipelines and Terraform infrastructure |
| `agents-cli infra cicd` | One-command setup of entire CI/CD pipeline + infrastructure |
| `agents-cli scaffold upgrade` | Auto-upgrade to latest version while preserving customizations |

---

## Development

Edit your agent logic in `app/agent.py` and test with `agents-cli playground` - it auto-reloads on save.

## Deployment

```bash
gcloud config set project <your-project-id>
agents-cli deploy
```

To add CI/CD and Terraform, run `agents-cli scaffold enhance`.
To set up your production infrastructure, run `agents-cli infra cicd`.

## Observability

Built-in telemetry exports to Cloud Trace, BigQuery, and Cloud Logging.

## A2A Inspector

This agent supports the [A2A Protocol](https://a2a-protocol.org/). Use the [A2A Inspector](https://github.com/a2aproject/a2a-inspector) to test interoperability.
See the [A2A Inspector docs](https://github.com/a2aproject/a2a-inspector) for details.
