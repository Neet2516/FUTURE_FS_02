# Database Architecture: PaperCRM (SQLite + SQLx)

## Engine Choice: SQLite with SQLx
- Self-contained, zero-configuration local and Docker execution.
- High performance, single-file storage with WAL (Write-Ahead Logging) enabled.
- Automatic creation and auto-migration on server boot.

## Schema Definition

### 1. `users`
```sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Sales Rep',
    avatar_color TEXT NOT NULL DEFAULT '#fff9c4',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `contacts`
```sql
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'Qualified', 'Proposal', 'Customer', 'Churned'
    lead_value REAL NOT NULL DEFAULT 0.0,
    tags TEXT NOT NULL DEFAULT '[]', -- JSON array of string tags
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 3. `deals`
```sql
CREATE TABLE IF NOT EXISTS deals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    contact_id TEXT REFERENCES contacts(id) ON DELETE SET NULL,
    stage TEXT NOT NULL DEFAULT 'Lead In', -- 'Lead In', 'Contact Made', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'
    value REAL NOT NULL DEFAULT 0.0,
    probability INTEGER NOT NULL DEFAULT 50, -- 0-100%
    priority TEXT NOT NULL DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Urgent'
    expected_close TEXT,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 4. `tasks`
```sql
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    due_date TEXT,
    priority TEXT NOT NULL DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Urgent'
    completed BOOLEAN NOT NULL DEFAULT 0,
    color TEXT NOT NULL DEFAULT 'yellow', -- 'yellow', 'pink', 'green', 'blue'
    associated_type TEXT, -- 'contact', 'deal'
    associated_id TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 5. `activities`
```sql
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    activity_type TEXT NOT NULL, -- 'Call', 'Email', 'Meeting', 'Note', 'Stage Change'
    description TEXT NOT NULL,
    contact_id TEXT REFERENCES contacts(id) ON DELETE CASCADE,
    deal_id TEXT REFERENCES deals(id) ON DELETE CASCADE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes
- `CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);`
- `CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);`
- `CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);`
- `CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);`
