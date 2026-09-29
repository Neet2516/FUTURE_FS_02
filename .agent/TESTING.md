# Testing Strategy & Verification Plan

## 1. Rust Backend Testing
- **Compilation Check**: `cargo check --manifest-path backend/Cargo.toml`
- **Unit & Integration Tests**: `cargo test --manifest-path backend/Cargo.toml`
- **Endpoints Validation**:
  - Test `/health` returns status ok.
  - Test `/api/dashboard/stats` returns aggregate financial and deal calculations.
  - Test `/api/contacts` returns seed data with 200 OK.
  - Test `/api/deals/:id/stage` correctly mutates deal stage and records an activity audit log.
  - Test `/api/tasks` toggles completion state.

## 2. Frontend Build Verification
- Tested via Node Docker runner:
  ```bash
  docker run --rm -v $(pwd)/frontend:/app -w /app node:20-alpine sh -c "npm install && npm run build"
  ```
- Ensures all imports, JSX syntax, Tailwind configurations, and asset references pass clean compilation.

## 3. Docker Compose Verification
- Build and spin up: `docker compose up --build -d`
- Health check curl tests against `http://localhost:8080/health` and `http://localhost:5173`.
- Browser Subagent visual verification:
  - Check layout rendering, fonts (Kalam, Patrick Hand).
  - Verify wobbly borders and hard shadows.
  - Interact with Kanban board (move deal from Lead to Proposal).
  - Create new contact and verify instant update.
  - Toggle task to-do.
