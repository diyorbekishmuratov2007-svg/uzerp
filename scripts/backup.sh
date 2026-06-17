#!/bin/bash

# UzERP Database Backup Script
# Usage: ./scripts/backup.sh [backup_dir]
# Creates a timestamped PostgreSQL backup

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Load environment variables
if [ -f "$PROJECT_DIR/.env" ]; then
    set -a
    source "$PROJECT_DIR/.env"
    set +a
fi

# Configuration
BACKUP_DIR="${1:-$PROJECT_DIR/backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="${POSTGRES_DB:-uzerp}"
DB_USER="${POSTGRES_USER:-uzerp}"
CONTAINER_NAME="uzerp-postgres-prod"
BACKUP_FILE="uzerp_backup_${TIMESTAMP}.sql.gz"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

log_info "Starting database backup..."
log_info "Database: $DB_NAME"
log_info "Backup file: $BACKUP_PATH"

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    # Try development container
    CONTAINER_NAME="uzerp-postgres"
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        log_error "PostgreSQL container is not running!"
        exit 1
    fi
fi

# Create backup using pg_dump
docker exec "$CONTAINER_NAME" pg_dump \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --no-owner \
    --no-privileges \
    --format=plain \
    | gzip > "$BACKUP_PATH"

# Check if backup was created successfully
if [ -f "$BACKUP_PATH" ] && [ -s "$BACKUP_PATH" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    log_info "Backup created successfully!"
    log_info "File: $BACKUP_PATH"
    log_info "Size: $BACKUP_SIZE"
else
    log_error "Backup failed! File is empty or not created."
    exit 1
fi

# Remove backups older than 30 days
log_info "Cleaning up old backups (older than 30 days)..."
find "$BACKUP_DIR" -name "uzerp_backup_*.sql.gz" -mtime +30 -delete 2>/dev/null || true

# List recent backups
echo ""
log_info "Recent backups:"
ls -lh "$BACKUP_DIR"/uzerp_backup_*.sql.gz 2>/dev/null | tail -5

echo ""
echo "To restore this backup:"
echo "  gunzip -c $BACKUP_PATH | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME"
