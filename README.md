# 📝 PaperCRM — The Hand-Drawn Sketchbook CRM

> A full-stack, enterprise-ready Customer Relationship Management platform combining a high-performance **Rust (Axum)** engine with a tactile, expressive **React + Tailwind CSS** frontend inspired by physical artist sketchbooks, sticky notes, and draft notebooks.

---

## 🌟 Visual Identity & Design System

Unlike generic SaaS dashboards dominated by blurry purple AI neon gradients and sterile cards, **PaperCRM** introduces a human-crafted digital sketchbook aesthetic:
- **Creamy Paper Canvas**: Soft `#fdfbf7` textured paper with subtle notebook dot grids.
- **Charcoal Ink Strokes**: 2px solid `#2d2d2d` ink borders with wobbly border radii (`border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px`).
- **Hard Ink Shadows**: Deep `4px 4px 0px 0px #2d2d2d` and `8px 8px 0px 0px #2d2d2d` drop-shadows.
- **Physical Tactile Buttons**: Buttons depress on click (`translate-x-0.5 translate-y-0.5` with shadow reduction).
- **Physical Notebook Accents**: Spiral binding rings, washi tape corners, brass thumbtack pushpins, and tilted Post-It sticky notes.
- **Organic Typography**: Google Font `Kalam 700` for expressive headings and `Patrick Hand 400` for clean handwriting print.
- **Adapted Aceternity UI**: Hand-drawn Bento Grids, warm graphite spotlight reflections, and notebook divider tabs.

---

## 🏗️ System Architecture

```
                                  [ CLIENT BROWSER ]
                                          │
                      HTTP / REST (JSON)  │  Port 5173 (Vite Dev Server)
                      CORS & Proxied      │  [React 18 + Tailwind + Aceternity]
                                          ▼
                         [ RUST BACKEND - Axum 0.7 ]
                                     Port 8080
                                          │
    ┌─────────────────────────────────────┴─────────────────────────────────────┐
    │                                                                           │
    ▼                                     ▼                                     ▼
[ Routes & CORS ]               [ Services & Logic ]                  [ Database Engine ]
/api/dashboard                  Pipeline value calculations           SQLx Connection Pool
/api/deals                      Weighted stage transitions            SQLite with WAL Mode
/api/contacts                   Activity audit logging                Auto-Migrations
/api/tasks                      Task completion toggles               Rich Sample Dataset
/api/activities                 Lead status management                (/app/data/crm.db)
```

---

## 🚀 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Canvas Confetti |
| **Backend** | Rust (2021 Edition), Axum 0.7, Tokio (Multi-threaded async), Serde, Tower-HTTP, Tracing |
| **Database** | SQLite with SQLx, WAL mode enabled, automatic migrations & seeding |
| **Infrastructure** | Docker, Docker Compose, Multi-stage Linux builds, containerized Vite |
| **Coordination** | `.agent/` Shared Multi-Agent Context & Memory layer |

---

## 📁 Repository Structure

```
.
├── .agent/                      # Multi-Agent coordination layer & shared memory
│   ├── README.md                # Agent directory index
│   ├── PROJECT_CONTEXT.md       # High-level mission and architecture goals
│   ├── ARCHITECTURE.md          # Multi-tier systems architecture
│   ├── REQUIREMENTS.md          # Functional requirements specification
│   ├── DESIGN_SYSTEM.md         # Hand-drawn design system & tokens
│   ├── API_CONTRACT.md          # Complete RESTful endpoint definitions
│   ├── DATABASE.md              # SQLite schema, tables, and indexes
│   ├── TASK_BOARD.md            # Active task tracking board
│   ├── DECISIONS.md             # Architectural Decision Records (ADRs)
│   ├── PROGRESS.md              # Milestones and completed deliverables
│   ├── TESTING.md               # Testing matrix and validation procedures
│   ├── INTEGRATION.md           # End-to-end integration checklist
│   └── handoffs/                # Domain-specific handoff notes
│       ├── frontend.md
│       ├── backend.md
│       ├── database.md
│       ├── infrastructure.md
│       ├── testing.md
│       └── integration.md
├── Task/                        # Source of truth requirements
│   └── REQUIREMENTS.md
├── backend/                     # Rust backend Axum application
│   ├── Cargo.toml               # Crate dependencies
│   ├── Dockerfile               # Multi-stage release build
│   ├── .env.example             # Backend environment template
│   ├── src/
│   │   ├── main.rs              # Application entrypoint & server binding
│   │   ├── lib.rs               # Library root and module exports
│   │   ├── db/                  # SQLite connection pool, migrations, and seeding
│   │   ├── errors.rs            # AppError and JSON error response mapping
│   │   ├── handlers/            # HTTP endpoint handlers
│   │   ├── models/              # Serde and SQLx domain data models
│   │   ├── routes/              # Axum route definitions and CORS layers
│   │   ├── schemas/             # Request DTOs and validation schemas
│   │   ├── services/            # Core business logic
│   │   └── state.rs             # AppState with database pool
│   └── tests/                   # Integration test suite
│       └── api_tests.rs
├── frontend/                    # React + Tailwind frontend application
│   ├── package.json             # NPM dependencies
│   ├── Dockerfile               # Containerized Vite dev server (Node not needed on host)
│   ├── vite.config.js           # Vite configuration with proxy to port 8080
│   ├── tailwind.config.js       # Hand-drawn design tokens & wobbly utilities
│   ├── src/
│   │   ├── main.jsx             # React DOM root
│   │   ├── App.jsx              # Application router & modal management
│   │   ├── index.css            # Paper textures, wobbly borders, hard shadows
│   │   ├── context/             # AuthContext & instant demo account switcher
│   │   ├── services/api.js      # REST API client
│   │   ├── components/
│   │   │   ├── ui/              # WobblyButton, WobblyCard, StickyNote, WashiTape,
│   │   │   │                    # Thumbtack, BentoGrid, CardSpotlight, Tabs, etc.
│   │   │   ├── layout/          # Spiral-bound Sidebar, Header, Page Layout
│   │   │   └── common/          # LoadingState, EmptyState, StatCard, QuickAddModal
│   │   └── pages/
│   │       ├── DashboardPage.jsx
│   │       ├── PipelineKanbanPage.jsx
│   │       ├── ContactsPage.jsx
│   │       ├── TasksPage.jsx
│   │       ├── ActivityLogPage.jsx
│   │       └── SettingsPage.jsx
├── docker-compose.yml           # Unified orchestration for backend and frontend
├── .env.example                 # Root environment configuration
└── README.md                    # Project documentation
```

---

## ⚡ Quick Start with Docker

> **Note**: You do **not** need Node.js installed locally. Everything is configured to run through Docker.

### 1. Clone & Setup Environment
```bash
git clone https://github.com/Neet2516/RUST_CRM-.git
cd RUST_CRM-
cp .env.example .env
```

### 2. Launch Services
```bash
docker compose up --build
```

### 3. Open in Browser
- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Rust Backend API**: [http://localhost:8080](http://localhost:8080)
- **Health Check**: [http://localhost:8080/health](http://localhost:8080/health)

---

## 🛠️ Local Development (Without Docker)

### Prerequisites
- **Rust**: `1.80+` (Installed via `rustup`)
- **Node.js** (Optional, only if running frontend outside Docker): `20+`

### 1. Run Rust Backend
```bash
cd backend
cargo run
```
The server will initialize `crm.db`, run migrations, seed sample data, and listen on `http://0.0.0.0:8080`.

### 2. Run React Frontend (Using Docker if local Node is not installed)
```bash
docker run -it --rm -p 5173:5173 -v $(pwd)/frontend:/app -w /app node:20-alpine sh -c "npm install && npm run dev -- --host 0.0.0.0"
```

---

## 🧪 Testing & Verification

### Backend Tests
```bash
cd backend
cargo test
```
Validates:
- SQLite in-memory initialization and auto-migrations
- Contact CRUD operations
- Deal stage advance and automatic audit activity logging
- Sticky note task completion toggles

### Frontend Build Check
```bash
docker run --rm -v $(pwd)/frontend:/app -w /app node:20-alpine sh -c "npm run build"
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Live system health and status |
| `GET` | `/api/dashboard/stats` | Pipeline KPI totals, stage counts, and recent activities |
| `GET` | `/api/contacts` | Search and filter contacts by status and tags |
| `POST` | `/api/contacts` | Create a new contact |
| `GET` | `/api/contacts/:id` | Get contact profile with associated deals and history |
| `PUT` | `/api/contacts/:id` | Update contact metadata |
| `DELETE` | `/api/contacts/:id` | Delete contact |
| `GET` | `/api/deals` | List all deals across the pipeline |
| `POST` | `/api/deals` | Create a new deal opportunity |
| `PUT` | `/api/deals/:id/stage` | Update deal stage (triggers audit log entry) |
| `DELETE` | `/api/deals/:id` | Remove deal |
| `GET` | `/api/tasks` | Get sticky note task checklist |
| `POST` | `/api/tasks` | Pin a new sticky note task |
| `PUT` | `/api/tasks/:id` | Update task or toggle completion status |
| `DELETE` | `/api/tasks/:id` | Discard sticky note |
| `GET` | `/api/activities` | List chronological audit log of team activities |

---

## 🤖 Antigravity Multi-Agent Workflow

This project was built following the **Antigravity Multi-Agent Architecture**:
- All persistent project memory is stored in the `.agent/` directory.
- Domain agents (Architect, Frontend, Backend, Database, Infrastructure, QA) coordinate strictly through contract files and handoff summaries (`.agent/handoffs/`).
- No hidden state or conversation dependency: the repository is self-documenting and self-contained.
