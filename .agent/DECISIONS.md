# Architectural Decision Records (ADR)

## ADR-001 — Backend Framework: Axum with Tokio
- **Status**: Accepted
- **Context**: The user requires a high-performance, modern Rust backend.
- **Decision**: Use Axum 0.7 on top of Tokio, Tower, and Tower HTTP.
- **Consequences**: First-class async performance, seamless extractor patterns, strong ecosystem compatibility for CORS, tracing, and JSON serialization.

## ADR-002 — Database Engine: SQLite with SQLx
- **Status**: Accepted
- **Context**: The system must run effortlessly both locally and in Docker without requiring external database server setup or cloud credentials.
- **Decision**: Use SQLite with SQLx connection pooling, WAL mode, and embedded migration scripts.
- **Consequences**: Zero external dependencies to run, persistent storage in volume, blazing fast query performance for CRM workloads.

## ADR-003 — Design System: Hand-Drawn Sketchbook Aesthetic
- **Status**: Accepted
- **Context**: Visual requirements strictly forbid generic SaaS templates or AI neon glow.
- **Decision**: Hand-drawn paper sketchbook design featuring `#fdfbf7` paper texture, `#2d2d2d` ink borders and hard shadows, `Kalam` and `Patrick Hand` handwriting typography, wobbly border radius utilities, sticky notes, and washi tape.
- **Consequences**: Distinctive, memorable, tactile user experience matching the provided visual identity.

## ADR-004 — Container-First Frontend Execution
- **Status**: Accepted
- **Context**: Host environment does not have Node.js / npm installed locally.
- **Decision**: Containerize frontend using Node 20 Docker container with Vite development server bound to `0.0.0.0:5173` and volume mounting for hot module replacement.
- **Consequences**: Host requires only Docker to run the complete stack.
