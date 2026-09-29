use crate::errors::AppError;
use sqlx::{
    sqlite::{SqliteConnectOptions, SqlitePoolOptions},
    SqlitePool,
};
use std::str::FromStr;
use tracing::info;

pub async fn init_pool(database_url: &str) -> Result<SqlitePool, AppError> {
    let connection_options = SqliteConnectOptions::from_str(database_url)
        .map_err(|e| AppError::Internal(format!("Invalid database connection string: {}", e)))?
        .create_if_missing(true)
        .journal_mode(sqlx::sqlite::SqliteJournalMode::Wal)
        .synchronous(sqlx::sqlite::SqliteSynchronous::Normal);

    let pool = SqlitePoolOptions::new()
        .max_connections(10)
        .connect_with(connection_options)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to connect to SQLite: {}", e)))?;

    run_migrations(&pool).await?;
    seed_data(&pool).await?;

    Ok(pool)
}

pub async fn run_migrations(pool: &SqlitePool) -> Result<(), AppError> {
    info!("Running database schema migrations...");

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'Sales Rep',
            avatar_color TEXT NOT NULL DEFAULT '#fff9c4',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS contacts (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            company TEXT NOT NULL,
            title TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            status TEXT NOT NULL DEFAULT 'New',
            lead_value REAL NOT NULL DEFAULT 0.0,
            tags TEXT NOT NULL DEFAULT '[]',
            notes TEXT,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS deals (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            contact_id TEXT,
            contact_name TEXT,
            stage TEXT NOT NULL DEFAULT 'Lead In',
            value REAL NOT NULL DEFAULT 0.0,
            probability INTEGER NOT NULL DEFAULT 50,
            priority TEXT NOT NULL DEFAULT 'Medium',
            expected_close TEXT,
            notes TEXT,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            due_date TEXT,
            priority TEXT NOT NULL DEFAULT 'Medium',
            completed BOOLEAN NOT NULL DEFAULT 0,
            color TEXT NOT NULL DEFAULT 'yellow',
            associated_type TEXT,
            associated_id TEXT,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS activities (
            id TEXT PRIMARY KEY,
            activity_type TEXT NOT NULL,
            description TEXT NOT NULL,
            contact_id TEXT,
            deal_id TEXT,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
            FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
        CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
        CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
        CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);
        "#,
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::Internal(format!("Migration failed: {}", e)))?;

    info!("Database migrations applied successfully.");
    Ok(())
}

pub async fn seed_data(pool: &SqlitePool) -> Result<(), AppError> {
    let user_count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM users")
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to count users: {}", e)))?;

    if user_count.0 > 0 {
        info!("Database already initialized with data. Skipping seed.");
        return Ok(());
    }

    info!("Seeding realistic CRM sample dataset...");

    // 1. Seed Users
    sqlx::query(
        r#"
        INSERT INTO users (id, name, email, password_hash, role, avatar_color, created_at)
        VALUES 
            ('usr_001', 'Sarah Miller', 'sarah@papercrm.io', 'demo_hash_sarah', 'Lead Account Executive', '#fff9c4', '2026-09-01 09:00:00'),
            ('usr_002', 'Alex Chen', 'alex@papercrm.io', 'demo_hash_alex', 'Sales Director', '#ffd1dc', '2026-09-01 09:00:00');
        "#,
    )
    .execute(pool)
    .await?;

    // 2. Seed Contacts
    sqlx::query(
        r#"
        INSERT INTO contacts (id, name, company, title, email, phone, status, lead_value, tags, notes, created_at, updated_at)
        VALUES
            ('ct_001', 'Jane Cooper', 'Acme Dynamics', 'VP of Infrastructure', 'jane@acmedynamics.com', '+1 (555) 234-5678', 'Qualified', 45000.0, '["Enterprise", "Cloud", "High Priority"]', 'Interested in migrating legacy workflows to high-speed Rust microservices.', '2026-09-10 10:30:00', '2026-09-28 14:20:00'),
            ('ct_002', 'Liam Vance', 'Horizon Robotics', 'Head of Procurement', 'liam@horizonrobotics.io', '+1 (555) 345-6789', 'Proposal', 78000.0, '["Robotics", "Hardware", "Annual Contract"]', 'Reviewing RFP terms. Requested discount on multi-year commitment.', '2026-09-12 11:15:00', '2026-09-28 16:45:00'),
            ('ct_003', 'Elena Rostova', 'QuantumLeap AI', 'Chief Technology Officer', 'elena@quantumleap.ai', '+1 (555) 456-7890', 'Meeting Scheduled', 95000.0, '["AI/ML", "Strategic", "Fast Growth"]', 'Demo scheduled for next Tuesday at 2 PM PST.', '2026-09-15 08:45:00', '2026-09-27 10:00:00'),
            ('ct_004', 'Marcus Sterling', 'Apex Financial Group', 'Managing Director', 'marcus@apexfinancial.com', '+1 (555) 567-8901', 'Contact Made', 32000.0, '["Fintech", "Compliance"]', 'Spoke at Singapore FinTech Expo. Sent preliminary one-pager.', '2026-09-18 14:00:00', '2026-09-25 11:30:00'),
            ('ct_005', 'Chloe Bennett', 'CloudWeave Systems', 'Director of Engineering', 'chloe@cloudweave.dev', '+1 (555) 678-9012', 'Won', 64000.0, '["DevOps", "Existing Client"]', 'Deal closed! Contract executed for 3-year term.', '2026-09-02 09:15:00', '2026-09-24 17:00:00'),
            ('ct_006', 'Dev Patel', 'Synthetix BioTech', 'Operations VP', 'dev@synthetixbio.com', '+1 (555) 789-0123', 'Lead In', 25000.0, '["Healthcare", "Inbound"]', 'Filled out contact form requesting pricing breakdown.', '2026-09-22 16:30:00', '2026-09-22 16:30:00'),
            ('ct_007', 'Olivia Wang', 'NeoLogistics Global', 'COO', 'olivia@neologistics.com', '+1 (555) 890-1234', 'Negotiation', 52000.0, '["Supply Chain", "Mid-Market"]', 'Redlining Master Services Agreement clauses 4 and 9.', '2026-09-08 13:20:00', '2026-09-28 11:00:00'),
            ('ct_008', 'Samuel Green', 'Pinecrest Media', 'Creative Director', 'sam@pinecrest.media', '+1 (555) 901-2345', 'Lost', 15000.0, '["Media", "Budget Freeze"]', 'Postponed project until Q1 next year due to budget reallocation.', '2026-09-05 15:45:00', '2026-09-20 12:00:00'),
            ('ct_009', 'Aria Montgomery', 'Hyperion Aerospace', 'Principal Architect', 'aria@hyperionaero.com', '+1 (555) 012-3456', 'Qualified', 85000.0, '["Aerospace", "Security Focus"]', 'Requires on-premise container deployment and air-gapped support.', '2026-09-19 10:00:00', '2026-09-27 15:30:00'),
            ('ct_010', 'Lucas Silva', 'Vortex Interactive', 'Product Lead', 'lucas@vortexplay.io', '+1 (555) 123-4567', 'New', 18000.0, '["Gaming", "Mobile"]', 'Referred by Chloe Bennett @ CloudWeave.', '2026-09-25 14:10:00', '2026-09-25 14:10:00');
        "#,
    )
    .execute(pool)
    .await?;

    // 3. Seed Deals
    sqlx::query(
        r#"
        INSERT INTO deals (id, title, company, contact_id, contact_name, stage, value, probability, priority, expected_close, notes, created_at, updated_at)
        VALUES
            ('dl_001', 'Cloud Infrastructure Modernization', 'Acme Dynamics', 'ct_001', 'Jane Cooper', 'Proposal Sent', 45000.0, 75, 'High', '2026-10-15', 'Full proposal sent with architecture roadmap.', '2026-09-12 10:00:00', '2026-09-28 15:00:00'),
            ('dl_002', 'Autonomous Fleet Monitoring Suite', 'Horizon Robotics', 'ct_002', 'Liam Vance', 'Negotiation', 78000.0, 85, 'Urgent', '2026-10-05', 'Legal team reviewing indemnity clauses.', '2026-09-14 11:30:00', '2026-09-28 16:45:00'),
            ('dl_003', 'Enterprise Inference Engine', 'QuantumLeap AI', 'ct_003', 'Elena Rostova', 'Meeting Scheduled', 95000.0, 60, 'High', '2026-11-01', 'Technical deep-dive presentation with engineering leads.', '2026-09-16 09:00:00', '2026-09-27 10:00:00'),
            ('dl_004', 'Real-Time Transaction Audit Hub', 'Apex Financial Group', 'ct_004', 'Marcus Sterling', 'Contact Made', 32000.0, 40, 'Medium', '2026-11-20', 'Follow up on security compliance questionnaires.', '2026-09-19 14:30:00', '2026-09-25 11:30:00'),
            ('dl_005', 'Kubernetes Multi-Cluster Orchestrator', 'CloudWeave Systems', 'ct_005', 'Chloe Bennett', 'Won', 64000.0, 100, 'High', '2026-09-24', 'Closed won! Onboarding session scheduled.', '2026-09-02 09:30:00', '2026-09-24 17:00:00'),
            ('dl_006', 'Cold Chain Telemetry Integration', 'NeoLogistics Global', 'ct_007', 'Olivia Wang', 'Proposal Sent', 52000.0, 70, 'Medium', '2026-10-25', 'Presented custom ROI model showing 34% cost savings.', '2026-09-10 14:00:00', '2026-09-28 11:00:00'),
            ('dl_007', 'Laboratory Sample Workflow SaaS', 'Synthetix BioTech', 'ct_006', 'Dev Patel', 'Lead In', 25000.0, 25, 'Low', '2026-12-10', 'First discovery call scheduled for Friday.', '2026-09-23 11:00:00', '2026-09-23 11:00:00'),
            ('dl_008', 'Mission Critical Telemetry Gateway', 'Hyperion Aerospace', 'ct_009', 'Aria Montgomery', 'Meeting Scheduled', 85000.0, 55, 'Urgent', '2026-11-15', 'Security clearance audit passed.', '2026-09-20 15:00:00', '2026-09-27 15:30:00'),
            ('dl_009', 'Asset Tracking Prototype', 'Pinecrest Media', 'ct_008', 'Samuel Green', 'Lost', 15000.0, 0, 'Low', '2026-09-20', 'Deferred to next financial year.', '2026-09-06 16:00:00', '2026-09-20 12:00:00'),
            ('dl_010', 'Live Game Ops Analytics Engine', 'Vortex Interactive', 'ct_010', 'Lucas Silva', 'Lead In', 18000.0, 30, 'Medium', '2026-11-30', 'Requested architecture whitepaper.', '2026-09-26 10:15:00', '2026-09-26 10:15:00');
        "#,
    )
    .execute(pool)
    .await?;

    // 4. Seed Tasks (Sticky Notes)
    sqlx::query(
        r#"
        INSERT INTO tasks (id, title, due_date, priority, completed, color, associated_type, associated_id, created_at)
        VALUES
            ('tsk_001', 'Prepare revised pricing schedule for Liam @ Horizon Robotics', '2026-09-30', 'Urgent', 0, 'yellow', 'deal', 'dl_002', '2026-09-28 10:00:00'),
            ('tsk_002', 'Send architecture whitepaper to Lucas Silva', '2026-10-01', 'Medium', 0, 'pink', 'contact', 'ct_010', '2026-09-28 11:30:00'),
            ('tsk_003', 'Schedule live demo rehearsal with Elena Rostova', '2026-10-02', 'High', 0, 'green', 'deal', 'dl_003', '2026-09-27 14:00:00'),
            ('tsk_004', 'Submit SOC2 compliance packet to Jane Cooper', '2026-09-29', 'Urgent', 1, 'yellow', 'contact', 'ct_001', '2026-09-25 09:00:00'),
            ('tsk_005', 'Finalize onboarding checklist for Chloe @ CloudWeave', '2026-09-28', 'High', 1, 'blue', 'deal', 'dl_005', '2026-09-24 16:00:00'),
            ('tsk_006', 'Quarterly sales pipeline review meeting with executive team', '2026-10-05', 'Medium', 0, 'yellow', NULL, NULL, '2026-09-28 17:00:00');
        "#,
    )
    .execute(pool)
    .await?;

    // 5. Seed Activities
    sqlx::query(
        r#"
        INSERT INTO activities (id, activity_type, description, contact_id, deal_id, created_at)
        VALUES
            ('act_001', 'Stage Change', 'Deal "Autonomous Fleet Monitoring Suite" moved to Negotiation', 'ct_002', 'dl_002', '2026-09-28 16:45:00'),
            ('act_002', 'Call', '30-minute sync call with Jane Cooper discussing SLA timeline', 'ct_001', 'dl_001', '2026-09-28 14:20:00'),
            ('act_003', 'Email', 'Sent revised contract agreement to Olivia Wang', 'ct_007', 'dl_006', '2026-09-28 11:00:00'),
            ('act_004', 'Meeting', 'Demo preparation call with Elena Rostova @ QuantumLeap AI', 'ct_003', 'dl_003', '2026-09-27 10:00:00'),
            ('act_005', 'Note', 'Aria requested air-gapped docker-compose specs for review', 'ct_009', 'dl_008', '2026-09-27 15:30:00'),
            ('act_006', 'Stage Change', 'Deal "Kubernetes Multi-Cluster Orchestrator" marked as Closed Won! 🎉', 'ct_005', 'dl_005', '2026-09-24 17:00:00'),
            ('act_007', 'Call', 'Introductory qualification phone call with Dev Patel', 'ct_006', 'dl_007', '2026-09-23 11:00:00');
        "#,
    )
    .execute(pool)
    .await?;

    info!("Database successfully seeded with realistic sample data.");
    Ok(())
}
