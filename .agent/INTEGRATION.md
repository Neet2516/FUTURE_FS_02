# Integration Plan & Status

## Data Flow
```
[React Browser View]
      │
  Vite Proxy / Direct HTTP
      │
[Rust Axum Server: 8080]
  ├── CORS Handler (permits frontend origin)
  ├── Route Dispatcher
  ├── Handlers & Services
  └── SQLx Pool
      └── SQLite DB (data/crm.db)
```

## Checklist
- [ ] CORS headers configured in Axum to accept requests from frontend (port 5173).
- [ ] Frontend API service configured with fallback base URL `http://localhost:8080/api` or `/api`.
- [ ] Database connection pool properly initializes tables and seeds test records on first run.
- [ ] Deal stage update successfully pushes an activity entry to `activities` table.
- [ ] Docker Compose networking allows frontend container and backend container to communicate.
