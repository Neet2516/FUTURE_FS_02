use crate::{
    errors::AppError,
    models::{Activity, Contact, ContactDetail, DashboardStats, Deal, Task, User},
    schemas::{
        AuthResponse, ContactQuery, CreateActivityRequest, CreateContactRequest, CreateDealRequest,
        CreateTaskRequest, LoginRequest, RegisterRequest, UpdateContactRequest, UpdateDealRequest,
        UpdateDealStageRequest, UpdateTaskRequest,
    },
    services::{
        ActivityService, AuthService, ContactService, DashboardService, DealService, TaskService,
    },
    state::AppState,
};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::json;

// -------------------------------------------------------------
// Health Check
// -------------------------------------------------------------
pub async fn health_check() -> impl IntoResponse {
    Json(json!({
        "status": "healthy",
        "service": "PaperCRM Backend",
        "version": "0.1.0",
        "aesthetic": "Hand-Drawn Sketchbook"
    }))
}

// -------------------------------------------------------------
// Auth Handlers
// -------------------------------------------------------------
pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<(StatusCode, Json<AuthResponse>), AppError> {
    let user = AuthService::register(&state.db, payload).await?;
    let token = format!("demo-token-{}", user.id);
    Ok((
        StatusCode::CREATED,
        Json(AuthResponse { token, user }),
    ))
}

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, AppError> {
    let user = AuthService::login(&state.db, payload).await?;
    let token = format!("demo-token-{}", user.id);
    Ok(Json(AuthResponse { token, user }))
}

pub async fn get_current_user(
    State(state): State<AppState>,
) -> Result<Json<User>, AppError> {
    // For demo simplicity, return primary user Sarah Miller
    let user = AuthService::get_user_by_id(&state.db, "usr_001").await?;
    Ok(Json(user))
}

// -------------------------------------------------------------
// Dashboard Handlers
// -------------------------------------------------------------
pub async fn get_dashboard_stats(
    State(state): State<AppState>,
) -> Result<Json<DashboardStats>, AppError> {
    let stats = DashboardService::get_stats(&state.db).await?;
    Ok(Json(stats))
}

// -------------------------------------------------------------
// Contacts Handlers
// -------------------------------------------------------------
pub async fn list_contacts(
    State(state): State<AppState>,
    Query(query): Query<ContactQuery>,
) -> Result<Json<Vec<Contact>>, AppError> {
    let contacts = ContactService::list(&state.db, query).await?;
    Ok(Json(contacts))
}

pub async fn get_contact(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<ContactDetail>, AppError> {
    let detail = ContactService::get_by_id(&state.db, &id).await?;
    Ok(Json(detail))
}

pub async fn create_contact(
    State(state): State<AppState>,
    Json(payload): Json<CreateContactRequest>,
) -> Result<(StatusCode, Json<Contact>), AppError> {
    let contact = ContactService::create(&state.db, payload).await?;
    Ok((StatusCode::CREATED, Json(contact)))
}

pub async fn update_contact(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateContactRequest>,
) -> Result<Json<Contact>, AppError> {
    let contact = ContactService::update(&state.db, &id, payload).await?;
    Ok(Json(contact))
}

pub async fn delete_contact(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<StatusCode, AppError> {
    ContactService::delete(&state.db, &id).await?;
    Ok(StatusCode::NO_CONTENT)
}

// -------------------------------------------------------------
// Deals Handlers
// -------------------------------------------------------------
pub async fn list_deals(
    State(state): State<AppState>,
) -> Result<Json<Vec<Deal>>, AppError> {
    let deals = DealService::list(&state.db).await?;
    Ok(Json(deals))
}

pub async fn get_deal(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Deal>, AppError> {
    let deal = DealService::get_by_id(&state.db, &id).await?;
    Ok(Json(deal))
}

pub async fn create_deal(
    State(state): State<AppState>,
    Json(payload): Json<CreateDealRequest>,
) -> Result<(StatusCode, Json<Deal>), AppError> {
    let deal = DealService::create(&state.db, payload).await?;
    Ok((StatusCode::CREATED, Json(deal)))
}

pub async fn update_deal(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateDealRequest>,
) -> Result<Json<Deal>, AppError> {
    let deal = DealService::update(&state.db, &id, payload).await?;
    Ok(Json(deal))
}

pub async fn update_deal_stage(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateDealStageRequest>,
) -> Result<Json<Deal>, AppError> {
    let deal = DealService::update_stage(&state.db, &id, &payload.stage).await?;
    Ok(Json(deal))
}

pub async fn delete_deal(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<StatusCode, AppError> {
    DealService::delete(&state.db, &id).await?;
    Ok(StatusCode::NO_CONTENT)
}

// -------------------------------------------------------------
// Tasks Handlers
// -------------------------------------------------------------
pub async fn list_tasks(
    State(state): State<AppState>,
) -> Result<Json<Vec<Task>>, AppError> {
    let tasks = TaskService::list(&state.db).await?;
    Ok(Json(tasks))
}

pub async fn create_task(
    State(state): State<AppState>,
    Json(payload): Json<CreateTaskRequest>,
) -> Result<(StatusCode, Json<Task>), AppError> {
    let task = TaskService::create(&state.db, payload).await?;
    Ok((StatusCode::CREATED, Json(task)))
}

pub async fn update_task(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateTaskRequest>,
) -> Result<Json<Task>, AppError> {
    let task = TaskService::update(&state.db, &id, payload).await?;
    Ok(Json(task))
}

pub async fn delete_task(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<StatusCode, AppError> {
    TaskService::delete(&state.db, &id).await?;
    Ok(StatusCode::NO_CONTENT)
}

// -------------------------------------------------------------
// Activities Handlers
// -------------------------------------------------------------
pub async fn list_activities(
    State(state): State<AppState>,
) -> Result<Json<Vec<Activity>>, AppError> {
    let activities = ActivityService::list(&state.db, 50).await?;
    Ok(Json(activities))
}

pub async fn create_activity(
    State(state): State<AppState>,
    Json(payload): Json<CreateActivityRequest>,
) -> Result<(StatusCode, Json<Activity>), AppError> {
    let activity = ActivityService::create(&state.db, payload).await?;
    Ok((StatusCode::CREATED, Json(activity)))
}
