use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: String,
    pub name: String,
    pub email: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub role: String,
    pub avatar_color: String,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Contact {
    pub id: String,
    pub name: String,
    pub company: String,
    pub title: String,
    pub email: String,
    pub phone: Option<String>,
    pub status: String,
    pub lead_value: f64,
    pub tags: String, // Stored as JSON string
    pub notes: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContactDetail {
    #[serde(flatten)]
    pub contact: Contact,
    pub deals: Vec<Deal>,
    pub activities: Vec<Activity>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Deal {
    pub id: String,
    pub title: String,
    pub company: String,
    pub contact_id: Option<String>,
    pub contact_name: Option<String>,
    pub stage: String,
    pub value: f64,
    pub probability: i32,
    pub priority: String,
    pub expected_close: Option<String>,
    pub notes: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub due_date: Option<String>,
    pub priority: String,
    pub completed: bool,
    pub color: String,
    pub associated_type: Option<String>,
    pub associated_id: Option<String>,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Activity {
    pub id: String,
    pub activity_type: String,
    pub description: String,
    pub contact_id: Option<String>,
    pub deal_id: Option<String>,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StageBreakdown {
    pub stage: String,
    pub count: i64,
    pub value: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DashboardStats {
    pub total_pipeline_value: f64,
    pub active_deals_count: i64,
    pub won_deals_count: i64,
    pub win_rate_percentage: f64,
    pub total_contacts_count: i64,
    pub pending_tasks_count: i64,
    pub completed_tasks_count: i64,
    pub stage_breakdown: Vec<StageBreakdown>,
    pub recent_activities: Vec<Activity>,
}
