use papercrm_backend::{db, routes, state::AppState};
use std::env;
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Initialize environment variables from .env
    dotenvy::dotenv().ok();

    // 2. Setup Tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "papercrm_backend=debug,tower_http=debug,axum=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // 3. Connect to PostgreSQL database
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    info!("Connecting to PostgreSQL database...");
    let pool = db::init_pool(&database_url).await?;

    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "papercrm-handdrawn-supersecret-jwt-key".to_string());
    let state = AppState::new(pool, jwt_secret);

    // 4. Construct Router
    let app = routes::create_router(state);

    // 5. Start Server
    let host = env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("{}:{}", host, port);

    info!("✨ PaperCRM Hand-Drawn Backend listening on http://{}", addr);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
