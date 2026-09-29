use crate::{
    errors::AppError,
    models::{Activity, Contact, ContactDetail, DashboardStats, Deal, StageBreakdown, Task, User},
    schemas::{
        ContactQuery, CreateActivityRequest, CreateContactRequest, CreateDealRequest,
        CreateTaskRequest, LoginRequest, RegisterRequest, UpdateContactRequest, UpdateDealRequest,
        UpdateTaskRequest,
    },
};
use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

pub struct ContactService;

impl ContactService {
    pub async fn list(pool: &PgPool, query: ContactQuery) -> Result<Vec<Contact>, AppError> {
        let mut sql = "SELECT * FROM contacts WHERE 1=1".to_string();

        if let Some(ref search) = query.search {
            if !search.trim().is_empty() {
                sql.push_str(&format!(
                    " AND (name ILIKE '%{s}%' OR company ILIKE '%{s}%' OR email ILIKE '%{s}%')",
                    s = search.trim().replace('\'', "''")
                ));
            }
        }

        if let Some(ref status) = query.status {
            if !status.trim().is_empty() && status != "All" {
                sql.push_str(&format!(" AND status = '{}'", status.replace('\'', "''")));
            }
        }

        if let Some(ref tag) = query.tag {
            if !tag.trim().is_empty() {
                sql.push_str(&format!(" AND tags LIKE '%{}%'", tag.replace('\'', "''")));
            }
        }

        sql.push_str(" ORDER BY created_at DESC");

        let contacts = sqlx::query_as::<_, Contact>(&sql)
            .fetch_all(pool)
            .await?;

        Ok(contacts)
    }

    pub async fn get_by_id(pool: &PgPool, id: &str) -> Result<ContactDetail, AppError> {
        let contact = sqlx::query_as::<_, Contact>("SELECT * FROM contacts WHERE id = $1")
            .bind(id)
            .fetch_optional(pool)
            .await?
            .ok_or_else(|| AppError::NotFound(format!("Contact with id '{}' not found", id)))?;

        let deals = sqlx::query_as::<_, Deal>("SELECT * FROM deals WHERE contact_id = $1 ORDER BY created_at DESC")
            .bind(id)
            .fetch_all(pool)
            .await?;

        let activities = sqlx::query_as::<_, Activity>("SELECT * FROM activities WHERE contact_id = $1 ORDER BY created_at DESC")
            .bind(id)
            .fetch_all(pool)
            .await?;

        Ok(ContactDetail {
            contact,
            deals,
            activities,
        })
    }

    pub async fn create(pool: &PgPool, req: CreateContactRequest) -> Result<Contact, AppError> {
        let id = format!("ct_{}", &Uuid::new_v4().to_string()[..8]);
        let now = Utc::now().naive_utc();
        let status = req.status.unwrap_or_else(|| "New".to_string());
        let lead_value = req.lead_value.unwrap_or(0.0);
        let tags_json = serde_json::to_string(&req.tags.unwrap_or_default())
            .unwrap_or_else(|_| "[]".to_string());

        sqlx::query(
            r#"
            INSERT INTO contacts (id, name, company, title, email, phone, status, lead_value, tags, notes, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            "#,
        )
        .bind(&id)
        .bind(&req.name)
        .bind(&req.company)
        .bind(&req.title)
        .bind(&req.email)
        .bind(&req.phone)
        .bind(&status)
        .bind(lead_value)
        .bind(&tags_json)
        .bind(&req.notes)
        .bind(&now)
        .bind(&now)
        .execute(pool)
        .await?;

        // Log creation activity
        let _ = ActivityService::create(
            pool,
            CreateActivityRequest {
                activity_type: "Note".to_string(),
                description: format!("Created new contact: {} ({})", req.name, req.company),
                contact_id: Some(id.clone()),
                deal_id: None,
            },
        )
        .await;

        let contact = sqlx::query_as::<_, Contact>("SELECT * FROM contacts WHERE id = $1")
            .bind(&id)
            .fetch_one(pool)
            .await?;

        Ok(contact)
    }

    pub async fn update(
        pool: &PgPool,
        id: &str,
        req: UpdateContactRequest,
    ) -> Result<Contact, AppError> {
        let existing = sqlx::query_as::<_, Contact>("SELECT * FROM contacts WHERE id = $1")
            .bind(id)
            .fetch_optional(pool)
            .await?
            .ok_or_else(|| AppError::NotFound(format!("Contact with id '{}' not found", id)))?;

        let name = req.name.unwrap_or(existing.name);
        let company = req.company.unwrap_or(existing.company);
        let title = req.title.unwrap_or(existing.title);
        let email = req.email.unwrap_or(existing.email);
        let phone = req.phone.or(existing.phone);
        let status = req.status.unwrap_or(existing.status);
        let lead_value = req.lead_value.unwrap_or(existing.lead_value);
        let notes = req.notes.or(existing.notes);
        let tags_json = if let Some(tags) = req.tags {
            serde_json::to_string(&tags).unwrap_or(existing.tags)
        } else {
            existing.tags
        };
        let now = Utc::now().naive_utc();

        sqlx::query(
            r#"
            UPDATE contacts
            SET name = $1, company = $2, title = $3, email = $4, phone = $5, status = $6, lead_value = $7, tags = $8, notes = $9, updated_at = $10
            WHERE id = $11
            "#,
        )
        .bind(&name)
        .bind(&company)
        .bind(&title)
        .bind(&email)
        .bind(&phone)
        .bind(&status)
        .bind(lead_value)
        .bind(&tags_json)
        .bind(&notes)
        .bind(&now)
        .bind(id)
        .execute(pool)
        .await?;

        let updated = sqlx::query_as::<_, Contact>("SELECT * FROM contacts WHERE id = $1")
            .bind(id)
            .fetch_one(pool)
            .await?;

        Ok(updated)
    }

    pub async fn delete(pool: &PgPool, id: &str) -> Result<(), AppError> {
        let result = sqlx::query("DELETE FROM contacts WHERE id = $1")
            .bind(id)
            .execute(pool)
            .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::NotFound(format!("Contact with id '{}' not found", id)));
        }

        Ok(())
    }
}

pub struct DealService;

impl DealService {
    pub async fn list(pool: &PgPool) -> Result<Vec<Deal>, AppError> {
        let deals = sqlx::query_as::<_, Deal>("SELECT * FROM deals ORDER BY created_at DESC")
            .fetch_all(pool)
            .await?;
        Ok(deals)
    }

    pub async fn get_by_id(pool: &PgPool, id: &str) -> Result<Deal, AppError> {
        let deal = sqlx::query_as::<_, Deal>("SELECT * FROM deals WHERE id = $1")
            .bind(id)
            .fetch_optional(pool)
            .await?
            .ok_or_else(|| AppError::NotFound(format!("Deal with id '{}' not found", id)))?;
        Ok(deal)
    }

    pub async fn create(pool: &PgPool, req: CreateDealRequest) -> Result<Deal, AppError> {
        let id = format!("dl_{}", &Uuid::new_v4().to_string()[..8]);
        let now = Utc::now().naive_utc();
        let stage = req.stage.unwrap_or_else(|| "Lead In".to_string());
        let value = req.value.unwrap_or(0.0);
        let probability = req.probability.unwrap_or(50);
        let priority = req.priority.unwrap_or_else(|| "Medium".to_string());

        // Resolve contact name if contact_id is provided
        let mut contact_name = None;
        if let Some(ref cid) = req.contact_id {
            if let Ok(Some(c)) = sqlx::query_as::<_, Contact>("SELECT * FROM contacts WHERE id = $1")
                .bind(cid)
                .fetch_optional(pool)
                .await
            {
                contact_name = Some(c.name);
            }
        }

        sqlx::query(
            r#"
            INSERT INTO deals (id, title, company, contact_id, contact_name, stage, value, probability, priority, expected_close, notes, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            "#,
        )
        .bind(&id)
        .bind(&req.title)
        .bind(&req.company)
        .bind(&req.contact_id)
        .bind(&contact_name)
        .bind(&stage)
        .bind(value)
        .bind(probability)
        .bind(&priority)
        .bind(&req.expected_close)
        .bind(&req.notes)
        .bind(&now)
        .bind(&now)
        .execute(pool)
        .await?;

        // Log activity
        let _ = ActivityService::create(
            pool,
            CreateActivityRequest {
                activity_type: "Stage Change".to_string(),
                description: format!("Created deal '{}' in stage '{}' ($ {:.2})", req.title, stage, value),
                contact_id: req.contact_id.clone(),
                deal_id: Some(id.clone()),
            },
        )
        .await;

        let deal = sqlx::query_as::<_, Deal>("SELECT * FROM deals WHERE id = $1")
            .bind(&id)
            .fetch_one(pool)
            .await?;

        Ok(deal)
    }

    pub async fn update(pool: &PgPool, id: &str, req: UpdateDealRequest) -> Result<Deal, AppError> {
        let existing = Self::get_by_id(pool, id).await?;
        let title = req.title.unwrap_or(existing.title);
        let company = req.company.unwrap_or(existing.company);
        let contact_id = req.contact_id.or(existing.contact_id);
        let stage = req.stage.unwrap_or(existing.stage);
        let value = req.value.unwrap_or(existing.value);
        let probability = req.probability.unwrap_or(existing.probability);
        let priority = req.priority.unwrap_or(existing.priority);
        let expected_close = req.expected_close.or(existing.expected_close);
        let notes = req.notes.or(existing.notes);
        let now = Utc::now().naive_utc();

        let mut contact_name = existing.contact_name;
        if let Some(ref cid) = contact_id {
            if let Ok(Some(c)) = sqlx::query_as::<_, Contact>("SELECT * FROM contacts WHERE id = $1")
                .bind(cid)
                .fetch_optional(pool)
                .await
            {
                contact_name = Some(c.name);
            }
        }

        sqlx::query(
            r#"
            UPDATE deals
            SET title = $1, company = $2, contact_id = $3, contact_name = $4, stage = $5, value = $6, probability = $7, priority = $8, expected_close = $9, notes = $10, updated_at = $11
            WHERE id = $12
            "#,
        )
        .bind(&title)
        .bind(&company)
        .bind(&contact_id)
        .bind(&contact_name)
        .bind(&stage)
        .bind(value)
        .bind(probability)
        .bind(&priority)
        .bind(&expected_close)
        .bind(&notes)
        .bind(&now)
        .bind(id)
        .execute(pool)
        .await?;

        let updated = Self::get_by_id(pool, id).await?;
        Ok(updated)
    }

    pub async fn update_stage(pool: &PgPool, id: &str, new_stage: &str) -> Result<Deal, AppError> {
        let existing = Self::get_by_id(pool, id).await?;
        let now = Utc::now().naive_utc();

        let old_stage = existing.stage.clone();

        sqlx::query("UPDATE deals SET stage = $1, updated_at = $2 WHERE id = $3")
            .bind(new_stage)
            .bind(&now)
            .bind(id)
            .execute(pool)
            .await?;

        // Log stage transition in activities!
        let desc = if new_stage == "Won" {
            format!("Deal '{}' reached WON stage! 🎉 ($ {:.2})", existing.title, existing.value)
        } else {
            format!("Deal '{}' moved from '{}' -> '{}'", existing.title, old_stage, new_stage)
        };

        let _ = ActivityService::create(
            pool,
            CreateActivityRequest {
                activity_type: "Stage Change".to_string(),
                description: desc,
                contact_id: existing.contact_id.clone(),
                deal_id: Some(id.to_string()),
            },
        )
        .await;

        let updated = Self::get_by_id(pool, id).await?;
        Ok(updated)
    }

    pub async fn delete(pool: &PgPool, id: &str) -> Result<(), AppError> {
        let result = sqlx::query("DELETE FROM deals WHERE id = $1")
            .bind(id)
            .execute(pool)
            .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::NotFound(format!("Deal with id '{}' not found", id)));
        }

        Ok(())
    }
}

pub struct TaskService;

impl TaskService {
    pub async fn list(pool: &PgPool) -> Result<Vec<Task>, AppError> {
        let tasks = sqlx::query_as::<_, Task>("SELECT * FROM tasks ORDER BY completed ASC, created_at DESC")
            .fetch_all(pool)
            .await?;
        Ok(tasks)
    }

    pub async fn create(pool: &PgPool, req: CreateTaskRequest) -> Result<Task, AppError> {
        let id = format!("tsk_{}", &Uuid::new_v4().to_string()[..8]);
        let now = Utc::now().naive_utc();
        let priority = req.priority.unwrap_or_else(|| "Medium".to_string());
        let color = req.color.unwrap_or_else(|| "yellow".to_string());

        sqlx::query(
            r#"
            INSERT INTO tasks (id, title, due_date, priority, completed, color, associated_type, associated_id, created_at)
            VALUES ($1, $2, $3, $4, FALSE, $5, $6, $7, $8)
            "#,
        )
        .bind(&id)
        .bind(&req.title)
        .bind(&req.due_date)
        .bind(&priority)
        .bind(&color)
        .bind(&req.associated_type)
        .bind(&req.associated_id)
        .bind(&now)
        .execute(pool)
        .await?;

        let task = sqlx::query_as::<_, Task>("SELECT * FROM tasks WHERE id = $1")
            .bind(&id)
            .fetch_one(pool)
            .await?;

        Ok(task)
    }

    pub async fn update(pool: &PgPool, id: &str, req: UpdateTaskRequest) -> Result<Task, AppError> {
        let existing = sqlx::query_as::<_, Task>("SELECT * FROM tasks WHERE id = $1")
            .bind(id)
            .fetch_optional(pool)
            .await?
            .ok_or_else(|| AppError::NotFound(format!("Task with id '{}' not found", id)))?;

        let title = req.title.unwrap_or(existing.title);
        let due_date = req.due_date.or(existing.due_date);
        let priority = req.priority.unwrap_or(existing.priority);
        let completed = req.completed.unwrap_or(existing.completed);
        let color = req.color.unwrap_or(existing.color);

        sqlx::query(
            r#"
            UPDATE tasks
            SET title = $1, due_date = $2, priority = $3, completed = $4, color = $5
            WHERE id = $6
            "#,
        )
        .bind(&title)
        .bind(&due_date)
        .bind(&priority)
        .bind(completed)
        .bind(&color)
        .bind(id)
        .execute(pool)
        .await?;

        let updated = sqlx::query_as::<_, Task>("SELECT * FROM tasks WHERE id = $1")
            .bind(id)
            .fetch_one(pool)
            .await?;

        Ok(updated)
    }

    pub async fn delete(pool: &PgPool, id: &str) -> Result<(), AppError> {
        let result = sqlx::query("DELETE FROM tasks WHERE id = $1")
            .bind(id)
            .execute(pool)
            .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::NotFound(format!("Task with id '{}' not found", id)));
        }

        Ok(())
    }
}

pub struct ActivityService;

impl ActivityService {
    pub async fn list(pool: &PgPool, limit: i64) -> Result<Vec<Activity>, AppError> {
        let activities = sqlx::query_as::<_, Activity>(
            "SELECT * FROM activities ORDER BY created_at DESC LIMIT $1"
        )
        .bind(limit)
        .fetch_all(pool)
        .await?;

        Ok(activities)
    }

    pub async fn create(pool: &PgPool, req: CreateActivityRequest) -> Result<Activity, AppError> {
        let id = format!("act_{}", &Uuid::new_v4().to_string()[..8]);
        let now = Utc::now().naive_utc();

        sqlx::query(
            r#"
            INSERT INTO activities (id, activity_type, description, contact_id, deal_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            "#,
        )
        .bind(&id)
        .bind(&req.activity_type)
        .bind(&req.description)
        .bind(&req.contact_id)
        .bind(&req.deal_id)
        .bind(&now)
        .execute(pool)
        .await?;

        let activity = sqlx::query_as::<_, Activity>("SELECT * FROM activities WHERE id = $1")
            .bind(&id)
            .fetch_one(pool)
            .await?;

        Ok(activity)
    }
}

pub struct DashboardService;

impl DashboardService {
    pub async fn get_stats(pool: &PgPool) -> Result<DashboardStats, AppError> {
        // Calculate total pipeline value (all non-lost deals)
        let total_val: (Option<f64>,) = sqlx::query_as(
            "SELECT SUM(value) FROM deals WHERE stage != 'Lost'"
        )
        .fetch_one(pool)
        .await?;
        let total_pipeline_value = total_val.0.unwrap_or(0.0);

        // Active deals (not Won, not Lost)
        let active_cnt: (i64,) = sqlx::query_as(
            "SELECT COUNT(*) FROM deals WHERE stage NOT IN ('Won', 'Lost')"
        )
        .fetch_one(pool)
        .await?;
        let active_deals_count = active_cnt.0;

        // Won deals
        let won_cnt: (i64,) = sqlx::query_as(
            "SELECT COUNT(*) FROM deals WHERE stage = 'Won'"
        )
        .fetch_one(pool)
        .await?;
        let won_deals_count = won_cnt.0;

        // Lost deals
        let lost_cnt: (i64,) = sqlx::query_as(
            "SELECT COUNT(*) FROM deals WHERE stage = 'Lost'"
        )
        .fetch_one(pool)
        .await?;
        let lost_deals_count = lost_cnt.0;

        let closed_total = won_deals_count + lost_deals_count;
        let win_rate_percentage = if closed_total > 0 {
            ((won_deals_count as f64 / closed_total as f64) * 100.0 * 10.0).round() / 10.0
        } else {
            0.0
        };

        // Total contacts
        let contacts_cnt: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM contacts")
            .fetch_one(pool)
            .await?;
        let total_contacts_count = contacts_cnt.0;

        // Tasks pending vs completed
        let pending_tasks: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM tasks WHERE completed = FALSE")
            .fetch_one(pool)
            .await?;
        let completed_tasks: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM tasks WHERE completed = TRUE")
            .fetch_one(pool)
            .await?;

        // Stage breakdown
        let stages = vec![
            "Lead In",
            "Contact Made",
            "Meeting Scheduled",
            "Proposal Sent",
            "Negotiation",
            "Won",
            "Lost",
        ];

        let mut stage_breakdown = Vec::new();
        for st in stages {
            let row: (i64, Option<f64>) = sqlx::query_as(
                "SELECT COUNT(*), SUM(value) FROM deals WHERE stage = $1"
            )
            .bind(st)
            .fetch_one(pool)
            .await?;

            stage_breakdown.push(StageBreakdown {
                stage: st.to_string(),
                count: row.0,
                value: row.1.unwrap_or(0.0),
            });
        }

        // Recent 10 activities
        let recent_activities = ActivityService::list(pool, 10).await?;

        Ok(DashboardStats {
            total_pipeline_value,
            active_deals_count,
            won_deals_count,
            win_rate_percentage,
            total_contacts_count,
            pending_tasks_count: pending_tasks.0,
            completed_tasks_count: completed_tasks.0,
            stage_breakdown,
            recent_activities,
        })
    }
}

pub struct AuthService;

impl AuthService {
    pub async fn register(pool: &PgPool, req: RegisterRequest) -> Result<User, AppError> {
        let existing = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = $1")
            .bind(&req.email)
            .fetch_optional(pool)
            .await?;

        if existing.is_some() {
            return Err(AppError::BadRequest("User with this email already exists".to_string()));
        }

        let id = format!("usr_{}", &Uuid::new_v4().to_string()[..8]);
        let now = Utc::now().naive_utc();
        let role = req.role.unwrap_or_else(|| "Sales Rep".to_string());
        // Simple hash placeholder for demo CRM
        let password_hash = format!("hash_{}", req.password);
        let avatar_color = "#fff9c4".to_string();

        sqlx::query(
            r#"
            INSERT INTO users (id, name, email, password_hash, role, avatar_color, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            "#,
        )
        .bind(&id)
        .bind(&req.name)
        .bind(&req.email)
        .bind(&password_hash)
        .bind(&role)
        .bind(&avatar_color)
        .bind(&now)
        .execute(pool)
        .await?;

        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(&id)
            .fetch_one(pool)
            .await?;

        Ok(user)
    }

    pub async fn login(pool: &PgPool, req: LoginRequest) -> Result<User, AppError> {
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = $1")
            .bind(&req.email)
            .fetch_optional(pool)
            .await?
            .ok_or_else(|| AppError::Unauthorized("Invalid email or password".to_string()))?;

        // Allow demo login
        Ok(user)
    }

    pub async fn get_user_by_id(pool: &PgPool, id: &str) -> Result<User, AppError> {
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(id)
            .fetch_optional(pool)
            .await?
            .ok_or_else(|| AppError::NotFound("User not found".to_string()))?;

        Ok(user)
    }
}
