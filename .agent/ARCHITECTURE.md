# Architecture: PaperCRM

```
+-------------------------------------------------------------------------------+
|                             CLIENT BROWSER                                    |
|   Hand-Drawn Sketchbook React App (Port 5173 / Vite Dev Server)               |
|   [Kalam / Patrick Hand Typography | Wobbly Borders | Hard Ink Shadows]       |
+-------------------------------------------------------------------------------+
                                      |
                               HTTP / REST (JSON)
                               CORS Enabled
                                      v
+-------------------------------------------------------------------------------+
|                             RUST BACKEND (Axum)                               |
|   Port 8080 (Tokio Multi-threaded Async Runtime)                              |
|                                                                               |
|   +-------------------------------------------------------------------------+ |
|   | Middleware Layer (Tower HTTP Cors, TraceLogger, Auth Bearer Extraction) | |
|   +-------------------------------------------------------------------------+ |
|                                      |                                        |
|   +-------------------------------------------------------------------------+ |
|   | Router Layer: /api/auth, /api/contacts, /api/deals, /api/tasks, etc.    | |
|   +-------------------------------------------------------------------------+ |
|                                      |                                        |
|   +-------------------------------------------------------------------------+ |
|   | Handlers Layer: Request validation, DTO deserialization, HTTP responses | |
|   +-------------------------------------------------------------------------+ |
|                                      |                                        |
|   +-------------------------------------------------------------------------+ |
|   | Services Layer: Business logic, calculations, stage transition rules    | |
|   +-------------------------------------------------------------------------+ |
|                                      |                                        |
|   +-------------------------------------------------------------------------+ |
|   | Database Layer: SQLx async queries, prepared statements, migrations     | |
|   +-------------------------------------------------------------------------+ |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                            SQLITE DATABASE (SQLx)                             |
|   data/crm.db (Persistent file volume, WAL mode, Index optimization)          |
+-------------------------------------------------------------------------------+
```

## Layer Separation Rules
1. **Routes (`routes/`)**: Map endpoints to handler functions. No business logic.
2. **Handlers (`handlers/`)**: Extract request params/JSON, call services, map errors to HTTP responses.
3. **Services (`services/`)**: Core domain rules, calculations (e.g., pipeline totals, probability weighting, activity creation).
4. **Database (`db/`, `models/`)**: SQLx queries and struct representations.

## Container Network
- Network: `crm-network` (bridge)
- Backend container: `papercrm-backend` (port 8080:8080)
- Frontend container: `papercrm-frontend` (port 5173:5173)
- Shared Volumes: `sqlite_data` mounted to `/app/data` for database persistence.
