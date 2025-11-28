#!/bin/bash

#####################################################################
# Database Backup Script
# Creates daily backups of the MySQL database
# Retains backups for 30 days
#
# Usage: ./scripts/backup-database.sh
# Cron: 0 2 * * * /path/to/backend/scripts/backup-database.sh
#####################################################################

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
fi

# Configuration
BACKUP_DIR="../storage/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="tundua_backup_${DATE}.sql"
RETENTION_DAYS=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Tundua Database Backup Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${YELLOW}Creating backup directory...${NC}"
    mkdir -p "$BACKUP_DIR"
fi

# Check if mysqldump is available
if ! command -v mysqldump &> /dev/null; then
    echo -e "${RED}Error: mysqldump command not found${NC}"
    echo -e "${RED}Please install MySQL client tools${NC}"
    exit 1
fi

# Database credentials from .env
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE:-tundua_saas}
DB_USERNAME=${DB_USERNAME:-root}
DB_PASSWORD=${DB_PASSWORD}

echo -e "Database: ${YELLOW}${DB_DATABASE}${NC}"
echo -e "Host: ${YELLOW}${DB_HOST}:${DB_PORT}${NC}"
echo -e "Backup file: ${YELLOW}${BACKUP_FILE}${NC}"
echo ""

# Create backup
echo -e "${GREEN}Creating backup...${NC}"
mysqldump \
    --host="${DB_HOST}" \
    --port="${DB_PORT}" \
    --user="${DB_USERNAME}" \
    --password="${DB_PASSWORD}" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --add-drop-table \
    --databases "${DB_DATABASE}" \
    > "${BACKUP_DIR}/${BACKUP_FILE}"

# Check if backup was successful
if [ $? -eq 0 ]; then
    # Compress backup
    echo -e "${GREEN}Compressing backup...${NC}"
    gzip "${BACKUP_DIR}/${BACKUP_FILE}"

    COMPRESSED_FILE="${BACKUP_FILE}.gz"
    BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${COMPRESSED_FILE}" | cut -f1)

    echo -e "${GREEN}✓ Backup created successfully!${NC}"
    echo -e "File: ${YELLOW}${COMPRESSED_FILE}${NC}"
    echo -e "Size: ${YELLOW}${BACKUP_SIZE}${NC}"
    echo ""

    # Delete old backups
    echo -e "${GREEN}Cleaning up old backups (older than ${RETENTION_DAYS} days)...${NC}"
    find "${BACKUP_DIR}" -name "tundua_backup_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete

    # Count remaining backups
    BACKUP_COUNT=$(find "${BACKUP_DIR}" -name "tundua_backup_*.sql.gz" -type f | wc -l)
    echo -e "${GREEN}Total backups: ${BACKUP_COUNT}${NC}"
    echo ""

    # Display recent backups
    echo -e "${GREEN}Recent backups:${NC}"
    ls -lht "${BACKUP_DIR}"/tundua_backup_*.sql.gz | head -5

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Backup completed successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"

    exit 0
else
    echo -e "${RED}✗ Backup failed!${NC}"
    echo -e "${RED}Please check database credentials and connection${NC}"
    exit 1
fi
