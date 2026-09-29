# .agent/ - Multi-Agent Coordination & Shared Memory Layer

This directory serves as the centralized, persistent context repository for all Antigravity agents working on **PaperCRM**.

## Core Knowledge Files
- **`PROJECT_CONTEXT.md`**: Mission, core objectives, and high-level project status.
- **`ARCHITECTURE.md`**: System architecture, layer separation, data flow, container network.
- **`REQUIREMENTS.md`**: Functional and visual specifications mirrored from `Task/`.
- **`DESIGN_SYSTEM.md`**: The hand-drawn sketchbook aesthetic tokens, wobbly utilities, hard shadows, typography, and Aceternity adaptations.
- **`API_CONTRACT.md`**: RESTful API endpoints, request/response JSON schemas, error codes.
- **`DATABASE.md`**: SQLite / SQLx schema, migrations, relations, indexes, seed records.
- **`AGENT_PROTOCOL.md`**: Operational rules for inter-agent collaboration and handoffs.
- **`TASK_BOARD.md`**: Active work tracker across Discovery, Frontend, Backend, Database, Infrastructure, QA.
- **`DECISIONS.md`**: Architectural Decision Records (ADRs).
- **`PROGRESS.md`**: Real-time progress log (Completed, In Progress, Blocked, Next).
- **`TESTING.md`**: Build validation, unit tests, integration test plans.
- **`INTEGRATION.md`**: Frontend-backend-database connectivity verification.
- **`BLOCKERS.md`**: Log of any blocking issues, root causes, and resolutions.

## Domain Handoffs (`handoffs/`)
Domain agents write updates here after each work unit:
- `handoffs/frontend.md`
- `handoffs/backend.md`
- `handoffs/database.md`
- `handoffs/infrastructure.md`
- `handoffs/testing.md`
- `handoffs/integration.md`
