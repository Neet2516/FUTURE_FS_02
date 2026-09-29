use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct ContactQuery {
    pub search: Option<String>,
    pub status: Option<String>,
    pub tag: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateContactRequest {
    pub name: String,
    pub company: String,
    pub title: String,
    pub email: String,
    pub phone: Option<String>,
    pub status: Option<String>,
    pub lead_value: Option<f64>,
    pub tags: Option<Vec<String>>,
    pub notes: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateContactRequest {
    pub name: Option<String>,
    pub company: Option<String>,
    pub title: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub status: Option<String>,
    pub lead_value: Option<f64>,
    pub tags: Option<Vec<String>>,
    pub notes: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateDealRequest {
    pub title: String,
    pub company: String,
    pub contact_id: Option<String>,
    pub stage: Option<String>,
    pub value: Option<f64>,
    pub probability: Option<i64>,
    pub priority: Option<String>,
    pub expected_close: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateDealRequest {
    pub title: Option<String>,
    pub company: Option<String>,
    pub contact_id: Option<String>,
    pub stage: Option<String>,
    pub value: Option<f64>,
    pub probability: Option<i64>,
    pub priority: Option<String>,
    pub expected_close: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateDealStageRequest {
    pub stage: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateTaskRequest {
    pub title: String,
    pub due_date: Option<String>,
    pub priority: Option<String>,
    pub color: Option<String>,
    pub associated_type: Option<String>,
    pub associated_id: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTaskRequest {
    pub title: Option<String>,
    pub due_date: Option<String>,
    pub priority: Option<String>,
    pub completed: Option<bool>,
    pub color: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateActivityRequest {
    pub activity_type: String,
    pub description: String,
    pub contact_id: Option<String>,
    pub deal_id: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub name: String,
    pub email: String,
    pub password: String,
    pub role: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: crate::models::User,
}
