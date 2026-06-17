#!/bin/bash

# UzERP Production Deployment Script
# Usage: ./scripts/deploy.sh [--first-run]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f "$PROJECT_DIR/.env" ]; then
    log_error ".env file not found! Copy .env.example and configure it:"
    log_error "  cp .env.example .env"
    exit 1
fi

# Load environment variables
set -a
source "$PROJECT_DIR/.env"
set +a

cd "$PROJECT_DIR"

log_info "Starting UzERP production deployment..."

# Pull latest code (if git repo)
if [ -d ".git" ]; then
    log_info "Pulling latest changes..."
    git pull origin main
fi

# Build and start containers
log_info "Building and starting Docker containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for database to be ready
log_info "Waiting for database to be ready..."
sleep 10

# Run database migrations
log_info "Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T api npx prisma migrate deploy

# First run: seed the database
if [ "$1" = "--first-run" ]; then
    log_info "First run detected. Seeding database..."
    docker-compose -f docker-compose.prod.yml exec -T api npx prisma db seed
    log_info "Database seeded successfully!"
fi

# Check health
log_info "Checking API health..."
sleep 5
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health 2>/dev/null || echo "000")

if [ "$HEALTH_STATUS" = "200" ]; then
    log_info "API is healthy! (HTTP $HEALTH_STATUS)"
else
    log_warn "API health check returned HTTP $HEALTH_STATUS. It may still be starting up."
fi

# Check web frontend
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")

if [ "$WEB_STATUS" = "200" ]; then
    log_info "Web frontend is healthy! (HTTP $WEB_STATUS)"
else
    log_warn "Web frontend returned HTTP $WEB_STATUS. It may still be starting up."
fi

log_info "Deployment complete!"
echo ""
echo "Services:"
echo "  - Web:     http://localhost:3000"
echo "  - API:     http://localhost:3001"
echo "  - Nginx:   http://localhost:80 (HTTPS: https://localhost:443)"
echo ""
echo "Useful commands:"
echo "  - View logs:      docker-compose -f docker-compose.prod.yml logs -f"
echo "  - Stop services:  docker-compose -f docker-compose.prod.yml down"
echo "  - Restart:        docker-compose -f docker-compose.prod.yml restart"
echo "  - Backup DB:      ./scripts/backup.sh"
