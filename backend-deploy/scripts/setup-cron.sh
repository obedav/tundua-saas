#!/bin/bash

#####################################################################
# Cron Jobs Setup Script
# Sets up automated tasks for the Tundua SaaS application
#
# Usage: ./scripts/setup-cron.sh
#####################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Tundua Cron Jobs Setup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Get the absolute path to the backend directory
BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "Backend directory: ${YELLOW}${BACKEND_DIR}${NC}"
echo ""

# Cron jobs to add
CRON_JOBS="
# Tundua SaaS Automated Tasks
# Added on $(date)

# Daily database backup at 2:00 AM
0 2 * * * cd ${BACKEND_DIR} && bash scripts/backup-database.sh >> storage/logs/backup.log 2>&1

# Daily security cleanup at 3:00 AM (rate limits, tokens, audit logs)
0 3 * * * cd ${BACKEND_DIR} && php scripts/cleanup-security.php >> storage/logs/cleanup.log 2>&1

# Weekly health check report (every Monday at 9:00 AM)
0 9 * * 1 cd ${BACKEND_DIR} && php scripts/health-check.php >> storage/logs/health.log 2>&1
"

echo -e "${YELLOW}The following cron jobs will be added:${NC}"
echo "$CRON_JOBS"
echo ""

# Ask for confirmation
read -p "Do you want to add these cron jobs to your crontab? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}Setup cancelled${NC}"
    exit 0
fi

# Create logs directory
mkdir -p "${BACKEND_DIR}/storage/logs"
mkdir -p "${BACKEND_DIR}/storage/backups"

# Make scripts executable
chmod +x "${BACKEND_DIR}/scripts/"*.sh
chmod +x "${BACKEND_DIR}/scripts/"*.php

# Add to crontab
(crontab -l 2>/dev/null; echo "$CRON_JOBS") | crontab -

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Cron jobs added successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Display current crontab
echo -e "${YELLOW}Current crontab:${NC}"
crontab -l

echo ""
echo -e "${GREEN}Setup completed!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Test backup script: ${GREEN}cd ${BACKEND_DIR} && bash scripts/backup-database.sh${NC}"
echo -e "2. Test cleanup script: ${GREEN}cd ${BACKEND_DIR} && php scripts/cleanup-security.php${NC}"
echo -e "3. Monitor logs in: ${GREEN}${BACKEND_DIR}/storage/logs/${NC}"
echo ""
