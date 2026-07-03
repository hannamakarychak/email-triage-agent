# AI Email Triage & Automation Engine 🚀

An autonomous AI agent built for the **Kaggle 5-Day AI Agents Intensive Course with Google**. 

## 📖 The Problem
Enterprise customer support teams are overwhelmed by the sheer volume of incoming emails. Human agents spend hours simply reading emails, deciding which department they belong to, prioritizing angry customers, and drafting repetitive apologies. This manual triage creates massive bottlenecks, delays critical responses to VIP customers, and increases the risk of churn.

## 💡 The Solution
This project is an **Autonomous Email Triage & Automation Engine** built using the Google Agent Development Kit (ADK) and Gemini Flash. 

When an email arrives, the agent doesn't just route it—it fully analyzes the business context:
1. **PII Redaction:** Credit cards and SSNs are mathematically scrubbed before ever touching an LLM.
2. **Deep Analysis:** The LLM extracts the sentiment, department, issue severity, and detects if the customer is a "Churn Risk".
3. **Priority Matrix:** A Python business-logic node calculates a mathematical Priority Score based on the customer's CRM tier (Bronze vs Platinum), severity, and escalation status.
4. **Agent Toolkit:** The AI instantly extracts a bulleted list of Action Items and generates a polite, context-aware Draft Response.
5. **Live Alerting:** If a high-priority customer is a churn risk, the system dynamically routes a live escalation alert directly to the supervisor's frontend dashboard.

## 🏗️ Architecture & Technical Design

This system moves beyond simple chatbot prompts by implementing a **Directed Acyclic Graph (DAG)** workflow (a ReAct-style agent).

- **Backend (FastAPI & Google ADK):** A decoupled, async Python backend hosts the Agent graph. It features dedicated nodes for distinct tasks (`pii_redactor` -> `analyzer` -> `prioritizer` -> `handlers`).
- **Frontend (Vanilla JS/CSS):** A sleek, modern "Glassmorphism" UI that simulates a real CRM dashboard. It features a live WebSocket-style "Escalation Feed" for urgent alerts.
- **Safety First:** Configured with strict Google Cloud `HarmBlockThreshold` settings and explicit Prompt Injection defenses at the system level.

## 📸 Dashboard Features
- **Metrics Grid:** Instantly see Department, Severity, Sentiment, and Mathematical Priority.
- **Support Toolkit:** Support agents receive exact Action Items and a 1-click "Copy" Draft Response, reducing resolution time from minutes to seconds.
- **Live Escalation Feed:** An asynchronous sidebar feed that catches and surfaces critical `priority_score > 90` alerts.

---

## 🚀 Quick Start (Local Development)

Before you begin, ensure you have:
- **uv**: Python package manager
- **agents-cli**: Install with `uv tool install google-agents-cli`

### 1. Install Dependencies
```bash
agents-cli install
```

### 2. Start the Backend API
In your first terminal, launch the FastAPI server:
```bash
uv run python app/fast_api_app.py
```

### 3. Start the Frontend Dashboard
In a second terminal, serve the UI:
```bash
python3 -m http.server 4000
```

Open `http://localhost:4000` in your browser. 

*Try pasting this email into the UI to trigger a live Churn Escalation alert:*
> "I am absolutely furious. My database went down again for the third time this month! I am a Platinum tier member and I expect better. Cancel my subscription immediately, I am moving to your competitor."

---

## 🧪 Evaluation & Testing
*(Coming Soon: We are utilizing `agents-cli eval` to run multi-turn synthetic dataset evaluations to mathematically prove our agent's accuracy).*
