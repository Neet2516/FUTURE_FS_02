# Project Context: PaperCRM (Hand-Drawn Sketchbook Rust CRM)

## Mission
To engineer a full-stack, enterprise-grade Customer Relationship Management system combining a high-performance, memory-safe **Rust (Axum)** backend with an expressive, tactile **React + Tailwind CSS** frontend that breaks away from generic AI templates by implementing a distinct **Hand-Drawn Sketchbook / Paper** aesthetic powered by adapted Aceternity UI components.

## Technical Foundation
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, adapted Aceternity UI components. Runs in Docker (Vite dev server with hot-reload exposed on port 5173).
- **Backend**: Rust 2021 edition, Axum 0.7, Tokio async runtime, SQLx, SQLite, Tower HTTP (Cors, Tracing), Serde JSON. Runs in Docker / native on port 8080.
- **Database**: SQLite (embedded, persistent volume in Docker, self-healing auto-migrations and comprehensive seed dataset).
- **Infrastructure**: Docker multi-stage builds and Docker Compose orchestration.

## Key Principles
1. **Expressive Tactile Design**: Paper backgrounds, wobbly hand-drawn borders, hard charcoal shadows, tilted sticky notes, washi tape, Kalam & Patrick Hand typography.
2. **Zero Missing Functionality**: Complete operational CRUD for Contacts, Deals pipeline Kanban, Tasks to-do, and Activity audit log.
3. **Robust Systems Architecture**: Clear separation of Routes -> Handlers -> Services -> Database.
4. **Runnable Out of the Box**: Node.js not required on the host system; entire stack starts via `docker compose up --build`.
