# 🚀 Tundua SaaS - Deployment Guide

## Overview

This guide covers deploying the Tundua SaaS application to production with all Phase 1 security features enabled.

**Phase 1 Status:** 85% Complete ✅
**Security Features:** Fully Integrated ✅
**CI/CD Pipeline:** Configured ✅
**Backup System:** Ready ✅

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Server Requirements](#server-requirements)
3. [Environment Setup](#environment-setup)
4. [Database Setup](#database-setup)
5. [Backend Deployment](#backend-deployment)
6. [Frontend Deployment](#frontend-deployment)
7. [Security Configuration](#security-configuration)
8. [Automation Setup](#automation-setup)
9. [Post-Deployment Verification](#post-deployment-verification)
10. [Monitoring](#monitoring)
11. [Rollback Procedure](#rollback-procedure)

---

## Pre-Deployment Checklist

### Required Files
- [ ] `.env` file configured for production
- [ ] SSL certificates installed
- [ ] Database credentials ready
- [ ] SMTP credentials for email
- [ ] Payment gateway credentials (Stripe, Paystack)
- [ ] OAuth credentials (Google)

### Code Readiness
- [ ] All tests passing (`npm test`, `vendor/bin/phpunit`)
- [ ] Code linting passed
- [ ] No security vulnerabilities (`composer audit`, `npm audit`)
- [ ] Environment variables validated
- [ ] Database migrations tested

### Infrastructure
- [ ] Domain configured with DNS
- [ ] Server accessible via SSH
- [ ] Database server running
- [ ] Backup storage available
- [ ] Monitoring tools configured

---

## Server Requirements

### Minimum Specifications

**Backend Server:**
- OS: Ubuntu 20.04+ / Debian 11+
- CPU: 2 cores
- RAM: 4GB
- Storage: 50GB SSD
- PHP: 8.2+
- MySQL: 8.0+
- Web Server: Nginx or Apache

**Frontend Server (can be same as backend):**
- Node.js: 20.x
- PM2: Latest
- Storage: 20GB

### Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2 and extensions
sudo apt install -y php8.2 php8.2-fpm php8.2-cli php8.2-mysql \
  php8.2-curl php8.2-xml php8.2-mbstring php8.2-zip php8.2-gd

# Install MySQL
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

---

## Environment Setup

### 1. Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/yourusername/tundua-saas.git
cd tundua-saas
sudo chown -R www-data:www-data .
```

### 2. Configure Environment Variables

**Backend `.env`:**

```bash
cd /var/www/tundua-saas/backend
cp .env.example .env
nano .env
```

```env
# Application
APP_NAME="Tundua SaaS"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

# Database
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=tundua_prod
DB_USERNAME=tundua_user
DB_PASSWORD=STRONG_PASSWORD_HERE

# JWT
JWT_SECRET=YOUR_VERY_LONG_RANDOM_SECRET_KEY_HERE
JWT_EXPIRY=3600
JWT_REFRESH_EXPIRY=2592000

# CORS
CORS_ORIGIN=https://yourdomain.com
CORS_CREDENTIALS=true

# Email (SendGrid, Mailgun, or SMTP)
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="Tundua SaaS"

# Payment Gateways
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=https://api.yourdomain.com/api/auth/google/callback

# Security
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MINUTES=15
REFRESH_TOKEN_ROTATION=true
```

**Frontend `.env`:**

```bash
cd /var/www/tundua-saas/frontend
cp .env.example .env.local
nano .env.local
```

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxxxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

---

## Database Setup

### 1. Create Database and User

```bash
sudo mysql
```

```sql
CREATE DATABASE tundua_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tundua_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON tundua_prod.* TO 'tundua_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Run Migrations

```bash
cd /var/www/tundua-saas/backend
vendor/bin/phinx migrate -e production
```

### 3. Seed Initial Data

```bash
vendor/bin/phinx seed:run
```

---

## Backend Deployment

### 1. Install Dependencies

```bash
cd /var/www/tundua-saas/backend
composer install --no-dev --optimize-autoloader
```

### 2. Create Required Directories

```bash
mkdir -p storage/{rate_limits,refresh_tokens,backups,logs,uploads}
chmod -R 775 storage
chown -R www-data:www-data storage
```

### 3. Configure Nginx

Create `/etc/nginx/sites-available/tundua-api`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    root /var/www/tundua-saas/backend/public;
    index index.php;

    access_log /var/log/nginx/tundua-api-access.log;
    error_log /var/log/nginx/tundua-api-error.log;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;
}
```

Enable site and get SSL:

```bash
sudo ln -s /etc/nginx/sites-available/tundua-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

## Frontend Deployment

### 1. Install Dependencies and Build

```bash
cd /var/www/tundua-saas/frontend
npm ci
npm run build
```

### 2. Configure PM2

```bash
pm2 start npm --name "tundua-frontend" -- start
pm2 save
pm2 startup
```

### 3. Configure Nginx for Frontend

Create `/etc/nginx/sites-available/tundua-frontend`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and get SSL:

```bash
sudo ln -s /etc/nginx/sites-available/tundua-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Security Configuration

### 1. Firewall Setup

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 2. Secure MySQL

```bash
sudo mysql_secure_installation
```

### 3. File Permissions

```bash
cd /var/www/tundua-saas
sudo chown -R www-data:www-data .
sudo find . -type f -exec chmod 644 {} \;
sudo find . -type d -exec chmod 755 {} \;
sudo chmod -R 775 backend/storage
```

---

## Automation Setup

### 1. Setup Cron Jobs

```bash
cd /var/www/tundua-saas/backend
bash scripts/setup-cron.sh
```

This creates:
- **Daily backups** at 2:00 AM
- **Security cleanup** at 3:00 AM (rate limits, tokens, audit logs)
- **Health checks** every Monday at 9:00 AM

### 2. Verify Cron Jobs

```bash
crontab -l
```

### 3. Test Scripts

```bash
# Test backup
bash scripts/backup-database.sh

# Test cleanup
php scripts/cleanup-security.php

# Test health check
php scripts/health-check.php
```

---

## Post-Deployment Verification

### 1. API Health Check

```bash
curl https://api.yourdomain.com/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-01-26 10:00:00"
}
```

### 2. Test Authentication Endpoints

```bash
# Test registration
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "Test@1234"
  }'

# Test rate limiting (try 6 times quickly)
for i in {1..6}; do
  curl -X POST https://api.yourdomain.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"wrong@example.com","password":"wrong"}'
  echo ""
done
```

### 3. Check Security Features

```bash
# Check audit logs
mysql -u tundua_user -p tundua_prod -e "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;"

# Check rate limit files
ls -la /var/www/tundua-saas/backend/storage/rate_limits/

# Check refresh tokens
ls -la /var/www/tundua-saas/backend/storage/refresh_tokens/
```

### 4. Frontend Verification

Visit: `https://yourdomain.com`
- [ ] Homepage loads
- [ ] Login works
- [ ] Registration works
- [ ] Dashboard accessible

---

## Monitoring

### 1. Log Monitoring

```bash
# Backend errors
tail -f /var/log/nginx/tundua-api-error.log

# Frontend PM2 logs
pm2 logs tundua-frontend

# Application logs
tail -f /var/www/tundua-saas/backend/storage/logs/cleanup.log
tail -f /var/www/tundua-saas/backend/storage/logs/backup.log
```

### 2. Weekly Health Reports

Check health report:
```bash
cat /var/www/tundua-saas/backend/storage/logs/health-report.json
```

### 3. Database Monitoring

```bash
# Check database size
mysql -u tundua_user -p -e "SELECT table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
  FROM information_schema.TABLES
  WHERE table_schema = 'tundua_prod';"
```

---

## Rollback Procedure

### 1. Restore Database Backup

```bash
cd /var/www/tundua-saas/backend
bash scripts/restore-database.sh storage/backups/tundua_backup_YYYYMMDD_HHMMSS.sql.gz
```

### 2. Rollback Code

```bash
cd /var/www/tundua-saas
git log  # Find commit hash
git checkout <previous-commit-hash>

# Backend
cd backend
composer install
sudo systemctl restart php8.2-fpm

# Frontend
cd ../frontend
npm ci
npm run build
pm2 restart tundua-frontend
```

---

## Troubleshooting

### Common Issues

**1. 500 Internal Server Error**
- Check PHP-FPM status: `sudo systemctl status php8.2-fpm`
- Check Nginx error logs: `tail -f /var/log/nginx/tundua-api-error.log`
- Verify file permissions: `ls -la /var/www/tundua-saas/backend/storage`

**2. Database Connection Failed**
- Verify credentials in `.env`
- Check MySQL status: `sudo systemctl status mysql`
- Test connection: `mysql -u tundua_user -p`

**3. Frontend Not Loading**
- Check PM2 status: `pm2 status`
- Check PM2 logs: `pm2 logs tundua-frontend`
- Verify build: `cd frontend && npm run build`

**4. Rate Limiting Not Working**
- Check storage directory permissions
- Verify middleware is loaded in `public/index.php`
- Check env variable: `RATE_LIMIT_ENABLED=true`

---

## GitHub Actions Secrets

Configure these secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description |
|-------------|-------------|
| `STAGING_SSH_KEY` | SSH private key for staging server |
| `STAGING_HOST` | Staging server IP/hostname |
| `STAGING_USER` | SSH username (e.g., ubuntu) |
| `STAGING_PATH` | Application path (e.g., /var/www/tundua-saas) |
| `STAGING_URL` | Staging URL (e.g., https://staging.yourdomain.com) |

---

## Success Criteria

Your deployment is successful when:

- ✅ API health check returns 200 OK
- ✅ Frontend loads without errors
- ✅ User can register and login
- ✅ Rate limiting is working (429 after limit)
- ✅ Audit logs are being created
- ✅ Backups are running daily
- ✅ SSL certificates are valid
- ✅ All tests passing in CI/CD

---

## Support

For deployment issues:
1. Check logs first (`/var/log/nginx/`, `pm2 logs`)
2. Review health check report
3. Verify environment variables
4. Check firewall rules

**Emergency Contacts:**
- DevOps: devops@yourdomain.com
- Security: security@yourdomain.com

---

**Last Updated:** 2025-01-26
**Phase 1 Status:** 85% Complete
**Security:** Production Ready ✅
