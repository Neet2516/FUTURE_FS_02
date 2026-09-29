# Agent Protocol: Collaboration & Handoff Standard

## 1. Context First Rule
Every agent MUST read `.agent/` context before starting work:
- Architect: `PROJECT_CONTEXT.md`, `REQUIREMENTS.md`, `ARCHITECTURE.md`
- Frontend: `DESIGN_SYSTEM.md`, `API_CONTRACT.md`, `handoffs/frontend.md`
- Backend: `API_CONTRACT.md`, `DATABASE.md`, `handoffs/backend.md`
- Database: `DATABASE.md`, `handoffs/database.md`
- Infrastructure: `ARCHITECTURE.md`, `handoffs/infrastructure.md`
- QA / Testing: `TESTING.md`, `INTEGRATION.md`, `handoffs/testing.md`

## 2. Handoff Standard
After completing a coherent unit of work:
1. Update `.agent/TASK_BOARD.md` check items.
2. Update `.agent/PROGRESS.md` with completed items and current next steps.
3. Write/update the specific domain file in `.agent/handoffs/` including:
   - What was implemented
   - Files changed
   - Components/Routes created
   - Dependencies added
   - Known limitations or test instructions
   - Required actions for subsequent agents.

## 3. No Duplication & Non-Destructive Edits
- Never overwrite or discard another domain agent's working code.
- Check existing files before creating duplicate logic.
- Log architectural choices in `.agent/DECISIONS.md`.
- Log blockers in `.agent/BLOCKERS.md`.
