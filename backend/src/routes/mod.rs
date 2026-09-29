use crate::{handlers, state::AppState};
use axum::{
    http::{header, Method},
    routing::{get, post, put},
    Router,
};
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;

pub fn create_router(state: AppState) -> Router {
    // Permissive CORS layer for local development and Docker networking
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::DELETE,
            Method::OPTIONS,
            Method::PATCH,
        ])
        .allow_headers([
            header::CONTENT_TYPE,
            header::AUTHORIZATION,
            header::ACCEPT,
            header::ORIGIN,
        ]);

    let auth_routes = Router::new()
        .route("/register", post(handlers::register))
        .route("/login", post(handlers::login))
        .route("/me", get(handlers::get_current_user));

    let dashboard_routes = Router::new()
        .route("/stats", get(handlers::get_dashboard_stats));

    let contacts_routes = Router::new()
        .route("/", get(handlers::list_contacts).post(handlers::create_contact))
        .route("/:id", get(handlers::get_contact).put(handlers::update_contact).delete(handlers::delete_contact));

    let deals_routes = Router::new()
        .route("/", get(handlers::list_deals).post(handlers::create_deal))
        .route("/:id", get(handlers::get_deal).put(handlers::update_deal).delete(handlers::delete_deal))
        .route("/:id/stage", put(handlers::update_deal_stage));

    let tasks_routes = Router::new()
        .route("/", get(handlers::list_tasks).post(handlers::create_task))
        .route("/:id", put(handlers::update_task).delete(handlers::delete_task));

    let activities_routes = Router::new()
        .route("/", get(handlers::list_activities).post(handlers::create_activity));

    let api_routes = Router::new()
        .nest("/auth", auth_routes)
        .nest("/dashboard", dashboard_routes)
        .nest("/contacts", contacts_routes)
        .nest("/deals", deals_routes)
        .nest("/tasks", tasks_routes)
        .nest("/activities", activities_routes);

    Router::new()
        .route("/health", get(handlers::health_check))
        .nest("/api", api_routes)
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}
