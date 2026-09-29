# Multi-stage Dockerfile for PaperCRM Rust Backend (PostgreSQL)
FROM rust:slim-bookworm AS builder

WORKDIR /usr/src/app

# Install build dependencies (PostgreSQL client dev libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    pkg-config \
    libpq-dev \
    gcc \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

# Cache dependency builds
COPY Cargo.toml Cargo.lock ./
# Create dummy main to compile dependencies first
RUN mkdir src && echo "fn main() {}" > src/main.rs && echo "pub fn dummy() {}" > src/lib.rs
RUN cargo build --release
RUN rm -rf src

# Copy real source code
COPY src ./src
# Touch files to force rebuild of the application code
RUN touch src/main.rs src/lib.rs
RUN cargo build --release

# Final runtime image
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary from builder
COPY --from=builder /usr/src/app/target/release/papercrm-backend /app/papercrm-backend

ENV HOST=0.0.0.0
ENV PORT=8080
ENV RUST_LOG=papercrm_backend=info,tower_http=info

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["/app/papercrm-backend"]
