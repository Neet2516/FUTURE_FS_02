use papercrm_backend::{
    db,
    schemas::{
        ContactQuery, CreateContactRequest, CreateDealRequest, CreateTaskRequest,
        UpdateContactRequest, UpdateTaskRequest,
    },
    services::{ContactService, DashboardService, DealService, TaskService},
};

/// Helper to get a database pool for testing.
/// Reads DATABASE_URL from environment (set via .env or CI).
async fn test_pool() -> sqlx::PgPool {
    dotenvy::dotenv().ok();
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set for tests");
    db::init_pool(&database_url).await.expect("Failed to init test db")
}

#[tokio::test]
async fn test_database_initialization_and_seeding() {
    let pool = test_pool().await;
    
    // Check that contacts were seeded
    let contacts = ContactService::list(&pool, ContactQuery {
        search: None,
        status: None,
        tag: None,
    })
    .await
    .expect("Failed to list contacts");

    assert!(!contacts.is_empty(), "Contacts should have been seeded");
    assert!(contacts.len() >= 10, "Should have at least 10 seeded contacts");

    // Check deals were seeded
    let deals = DealService::list(&pool).await.expect("Failed to list deals");
    assert!(!deals.is_empty(), "Deals should have been seeded");
    assert!(deals.len() >= 10, "Should have at least 10 seeded deals");

    // Check dashboard stats
    let stats = DashboardService::get_stats(&pool).await.expect("Failed to get dashboard stats");
    assert!(stats.total_pipeline_value > 0.0);
    assert!(stats.active_deals_count > 0);
    assert!(stats.total_contacts_count >= 10);
    assert_eq!(stats.stage_breakdown.len(), 7);
}

#[tokio::test]
async fn test_contact_crud_operations() {
    let pool = test_pool().await;

    // Create Contact
    let req = CreateContactRequest {
        name: "Test Contact".to_string(),
        company: "Test Corp".to_string(),
        title: "CTO".to_string(),
        email: "test@testcorp.com".to_string(),
        phone: Some("+123456789".to_string()),
        status: Some("Qualified".to_string()),
        lead_value: Some(50000.0),
        tags: Some(vec!["TestTag".to_string()]),
        notes: Some("Important note".to_string()),
    };

    let created = ContactService::create(&pool, req).await.expect("Create failed");
    assert_eq!(created.name, "Test Contact");
    assert_eq!(created.company, "Test Corp");

    // Update Contact
    let update_req = UpdateContactRequest {
        name: Some("Test Contact Updated".to_string()),
        company: None,
        title: None,
        email: None,
        phone: None,
        status: Some("Customer".to_string()),
        lead_value: Some(75000.0),
        tags: None,
        notes: None,
    };

    let updated = ContactService::update(&pool, &created.id, update_req).await.expect("Update failed");
    assert_eq!(updated.name, "Test Contact Updated");
    assert_eq!(updated.status, "Customer");
    assert_eq!(updated.lead_value, 75000.0);

    // Get Contact with details
    let detail = ContactService::get_by_id(&pool, &created.id).await.expect("Get by id failed");
    assert_eq!(detail.contact.name, "Test Contact Updated");

    // Delete Contact (cleanup)
    ContactService::delete(&pool, &created.id).await.expect("Delete failed");
    let fetch_result = ContactService::get_by_id(&pool, &created.id).await;
    assert!(fetch_result.is_err(), "Contact should no longer exist");
}

#[tokio::test]
async fn test_deal_stage_transition_and_activity_logging() {
    let pool = test_pool().await;

    let deal_req = CreateDealRequest {
        title: "Test Big Deal".to_string(),
        company: "Enterprise Co".to_string(),
        contact_id: None,
        stage: Some("Lead In".to_string()),
        value: Some(100000.0),
        probability: Some(30),
        priority: Some("Urgent".to_string()),
        expected_close: Some("2026-12-31".to_string()),
        notes: Some("Initial discussion".to_string()),
    };

    let deal = DealService::create(&pool, deal_req).await.expect("Failed to create deal");
    assert_eq!(deal.stage, "Lead In");

    // Advance stage to Won
    let updated_deal = DealService::update_stage(&pool, &deal.id, "Won").await.expect("Failed to update stage");
    assert_eq!(updated_deal.stage, "Won");

    // Check stats updated
    let stats = DashboardService::get_stats(&pool).await.expect("Failed to get stats");
    let won_stage = stats.stage_breakdown.iter().find(|s| s.stage == "Won").expect("Won stage not found");
    assert!(won_stage.count >= 1);

    // Cleanup
    DealService::delete(&pool, &deal.id).await.expect("Failed to cleanup deal");
}

#[tokio::test]
async fn test_task_lifecycle() {
    let pool = test_pool().await;

    let task_req = CreateTaskRequest {
        title: "Call CFO tomorrow".to_string(),
        due_date: Some("2026-10-01".to_string()),
        priority: Some("High".to_string()),
        color: Some("yellow".to_string()),
        associated_type: None,
        associated_id: None,
    };

    let task = TaskService::create(&pool, task_req).await.expect("Create task failed");
    assert!(!task.completed);

    // Toggle completed
    let update_req = UpdateTaskRequest {
        title: None,
        due_date: None,
        priority: None,
        completed: Some(true),
        color: None,
    };

    let updated = TaskService::update(&pool, &task.id, update_req).await.expect("Update task failed");
    assert!(updated.completed);

    // Cleanup
    TaskService::delete(&pool, &task.id).await.expect("Failed to cleanup task");
}
