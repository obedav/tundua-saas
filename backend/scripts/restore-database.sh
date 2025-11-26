#!/bin/bash

#####################################################################
# Database Restore Script
# Restores database from a backup file
#
# Usage: ./scripts/restore-database.sh <backup_file>
# Example: ./scripts/restore-database.sh ../storage/backups/tundua_backup_20250126_020000.sql.gz
#####################################################################

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Tundua Database Restore Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if backup file is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: No backup file specified${NC}"
    echo -e "${YELLOW}Usage: $0 <backup_file>${NC}"
    echo ""
    echo -e "Available backups:"
    ls -lt ../storage/backups/tundua_backup_*.sql.gz | head -10
    exit 1
fi

BACKUP_FILE=$1

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file not found: ${BACKUP_FILE}${NC}"
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

# Warning
echo -e "${RED}⚠️  WARNING ⚠️${NC}"
echo -e "${YELLOW}This will replace all data in the database: ${DB_DATABASE}${NC}"
echo -e "${YELLOW}Make sure you have a recent backup before proceeding!${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}Restore cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}Starting restore...${NC}"

# Decompress and restore
if [[ $BACKUP_FILE == *.gz ]]; then
    echo -e "${GREEN}Decompressing and restoring...${NC}"
    gunzip -c "$BACKUP_FILE" | mysql \
        --host="${DB_HOST}" \
        --port="${DB_PORT}" \
        --user="${DB_USERNAME}" \
        --password="${DB_PASSWORD}"
else
    echo -e "${GREEN}Restoring from uncompressed file...${NC}"
    mysql \
        --host="${DB_HOST}" \
        --port="${DB_PORT}" \
        --user="${DB_USERNAME}" \
        --password="${DB_PASSWORD}" \
        < "$BACKUP_FILE"
fi

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ Database restored successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}✗ Restore failed!${NC}"
    echo -e "${RED}========================================${NC}"
    exit 1
fi
