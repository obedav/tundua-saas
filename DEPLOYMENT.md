# Tundua VPS Migration Guide
## Hetzner VPS — 167.233.129.143

**Target:** Move Tundua from Vercel (frontend) + Syskay shared hosting (backend) to a single Hetzner VPS running Ubuntu, alongside FXKora.

---

## Assumptions

| # | Assumption |
|---|-----------|
| 1 | Ubuntu 22.04 LTS on the VPS |
| 2 | You SSH in as `root` — all commands assume root |
| 3 | Nginx is installed and running, managing FXKora via `/etc/nginx/sites-enabled/` |
| 4 | FXKora frontend container is bound to host port **3000** — Tundua will use **3001** |
| 5 | FXKora PostgreSQL lives inside Docker and is never touched |
| 6 | MySQL 8.0 is **not** installed on the host |
| 7 | PHP is **not** installed on the host |
| 8 | Node.js may or may not be installed |
| 9 | The repo is a **monorepo** at `https://github.com/obedav/tundua-saas.git` with `backend/` and `frontend/` subdirectories |
| 10 | The repo is **private** — a GitHub deploy key is required (steps included) |
| 11 | Certbot is not yet configured for `tundua.com` / `api.tundua.com` |
| 12 | DNS is **not yet pointed** at the VPS — SSL is provisioned after DNS is switched |
| 13 | `www.tundua.com` redirects to `tundua.com` (already handled in Next.js config) |

---

## Pre-flight: Commit the Standalone Build Flag

Before touching the VPS, ensure the `output: 'standalone'` flag is committed to the repo. It has already been added to `frontend/next.config.mjs`. Push it now from your local machine:

```bash
git add frontend/next.config.mjs
git commit -m "feat: add standalone output for VPS deployment"
git push
```

---

## Phase 1 — Backend (Slim 4 PHP on host)

### Step 1.1 — PHP 8.3 and required extensions

```bash
apt update && apt install -y software-properties-common
add-apt-repository -y ppa:ondrej/php
apt update

apt install -y \
  php8.3 \
  php8.3-fpm \
  php8.3-mysql \
  php8.3-mbstring \
  php8.3-zip \
  php8.3-curl \
  php8.3-xml \
  php8.3-bcmath \
  php8.3-intl \
  php8.3-gd \
  unzip \
  curl
```

Verify extensions:

```bash
php8.3 -m | grep -E 'pdo_mysql|mbstring|zip|curl|openssl'
```

### Step 1.2 — MySQL 8.0

```bash
apt install -y mysql-server
systemctl enable --now mysql

# Interactive — set a strong root password when prompted
mysql_secure_installation
```

Create the database and application user:

```bash
mysql -u root -p <<'SQL'
CREATE DATABASE tundua_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tundua_user'@'localhost' IDENTIFIED BY 'REPLACE_WITH_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON tundua_db.* TO 'tundua_user'@'localhost';
FLUSH PRIVILEGES;
SQL
```

> The backend `.env.example` names the database `tundua_saas`. This guide uses `tundua_db` — set `DB_DATABASE=tundua_db` in the `.env` file (Step 1.5).

### Step 1.3 — GitHub deploy key and clone

Generate the deploy key:

```bash
ssh-keygen -t ed25519 -C "tundua-vps-deploy" -f /root/.ssh/tundua_deploy -N ""
cat /root/.ssh/tundua_deploy.pub
```

**Pause here.** Copy the printed public key and add it to GitHub:
`GitHub → obedav/tundua-saas → Settings → Deploy keys → Add deploy key` (read-only is sufficient).

Then continue:

```bash
cat >> /root/.ssh/config <<'EOF'
Host github.com
  IdentityFile /root/.ssh/tundua_deploy
  StrictHostKeyChecking no
EOF

git clone git@github.com:obedav/tundua-saas.git /var/www/tundua-repo
ln -sfn /var/www/tundua-repo/backend  /var/www/tundua-backend
ln -sfn /var/www/tundua-repo/frontend /var/www/tundua-frontend
```

### Step 1.4 — Composer install

```bash
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

cd /var/www/tundua-backend
composer install --no-dev --optimize-autoloader
```

### Step 1.5 — Environment file

```bash
cp /var/www/tundua-backend/.env.example /var/www/tundua-backend/.env
```

Open `/var/www/tundua-backend/.env` and fill in every value marked `REPLACE`:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tundua.com
API_URL=https://api.tundua.com

DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=tundua_db
DB_USERNAME=tundua_user
DB_PASSWORD=REPLACE_WITH_STRONG_PASSWORD

# Generate: openssl rand -hex 32
JWT_SECRET=REPLACE_256BIT_RANDOM
JWT_ALGORITHM=HS256
JWT_EXPIRY=3600
JWT_REFRESH_EXPIRY=2592000

CORS_ORIGIN=https://tundua.com,https://www.tundua.com
CORS_CREDENTIALS=true

MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tunduaedu@gmail.com
MAIL_PASSWORD=REPLACE_GMAIL_APP_PASSWORD
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tunduaedu@gmail.com
MAIL_FROM_NAME="Tundua Education"

GA4_MEASUREMENT_ID=REPLACE_OR_LEAVE_BLANK
GA4_API_SECRET=REPLACE_OR_LEAVE_BLANK

PAYSTACK_PUBLIC_KEY=pk_live_REPLACE
PAYSTACK_SECRET_KEY=sk_live_REPLACE
PAYSTACK_CALLBACK_URL=https://api.tundua.com/api/payments/paystack/callback
PAYSTACK_SCHOLAR_PLAN_CODE=PLN_REPLACE

PUSHER_APP_ID=REPLACE
PUSHER_APP_KEY=REPLACE
PUSHER_APP_SECRET=REPLACE
PUSHER_APP_CLUSTER=REPLACE

SESSION_DOMAIN=api.tundua.com
SESSION_SECURE=true
SESSION_SAME_SITE=none

# Generate: openssl rand -hex 24
CRON_SECRET=REPLACE_RANDOM

VEPAAR_WEBHOOK_URL=REPLACE_OR_LEAVE_BLANK

REFRESH_TOKEN_ROTATION=true
BCRYPT_ROUNDS=12
```

Generate the two secrets in one shot:

```bash
echo "JWT_SECRET=$(openssl rand -hex 32)"
echo "CRON_SECRET=$(openssl rand -hex 24)"
```

### Step 1.6 — Database migrations

```bash
cd /var/www/tundua-backend
```

### Step 1.7 — File permissions

```bash
chmod -R 755 /var/www/tundua-backend
chown -R www-data:www-data /var/www/tundua-backend
chmod -R 775 /var/www/tundua-backend/storage
```

### Step 1.8 — Nginx server block for `api.tundua.com`

```bash
cat > /etc/nginx/sites-available/api.tundua.com <<'NGINX'
server {
    listen 80;
    server_name api.tundua.com;

    root /var/www/tundua-backend/public;
    index index.php;

    location ~ /\. {
        deny all;
    }

    location / {
        try_files $uri $uri/ /index.php$is_args$args;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        fastcgi_read_timeout 120;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 15M;
}
NGINX

ln -s /etc/nginx/sites-available/api.tundua.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### Phase 1 verification

```bash
# PHP-FPM is running
systemctl is-active php8.3-fpm

# MySQL is running and tundua_db has tables
mysql -u tundua_user -p tundua_db -e "SHOW TABLES;"

# Nginx config is valid
nginx -t

# API responds (before DNS switch, test via Host header)
curl -s -o /dev/null -w "%{http_code}" -H "Host: api.tundua.com" http://127.0.0.1/health
```

---

## Phase 2 — Frontend (Next.js on host with PM2)

### Step 2.1 — Node.js 20 via nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

echo 'export NVM_DIR="$HOME/.nvm"' >> /root/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /root/.bashrc

nvm install 20
nvm use 20
nvm alias default 20

node -v   # must print v20.x.x
```

### Step 2.2 — PM2

```bash
npm install -g pm2
pm2 -v
```

### Step 2.3 — Confirm `output: 'standalone'` is in the repo

```bash
grep "standalone" /var/www/tundua-frontend/next.config.mjs
# Must print: output: 'standalone',
```

If it does not appear, the commit from the Pre-flight step was not pushed. Pull and retry:

```bash
cd /var/www/tundua-repo && git pull
```

### Step 2.4 — Repo already cloned (Phase 1, Step 1.3)

`/var/www/tundua-frontend` is already a symlink to `/var/www/tundua-repo/frontend`. Nothing to do here.

### Step 2.5 — Production environment file

```bash
cat > /var/www/tundua-frontend/.env.production <<'ENV'
NEXT_PUBLIC_API_URL=https://api.tundua.com
NEXT_PUBLIC_APP_URL=https://tundua.com
NEXT_PUBLIC_APP_NAME=Tundua Study Abroad

# Sentry — leave blank to disable
NEXT_PUBLIC_SENTRY_DSN=REPLACE_OR_LEAVE_BLANK
SENTRY_ORG=REPLACE_OR_LEAVE_BLANK
SENTRY_PROJECT=tundua-frontend
SENTRY_AUTH_TOKEN=REPLACE_OR_LEAVE_BLANK

# PostHog — leave blank to disable
NEXT_PUBLIC_POSTHOG_KEY=REPLACE_OR_LEAVE_BLANK
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Pusher — must match backend values
NEXT_PUBLIC_PUSHER_KEY=REPLACE
NEXT_PUBLIC_PUSHER_CLUSTER=REPLACE

# AI features — leave blank if unused
ANTHROPIC_API_KEY=REPLACE_OR_LEAVE_BLANK
OPENAI_API_KEY=REPLACE_OR_LEAVE_BLANK

# Google OAuth — leave blank if unused
NEXT_PUBLIC_GOOGLE_CLIENT_ID=REPLACE_OR_LEAVE_BLANK
GOOGLE_CLIENT_SECRET=REPLACE_OR_LEAVE_BLANK
ENV
```

### Step 2.6 — Build

```bash
cd /var/www/tundua-frontend

# --ignore-scripts skips the postinstall type-check (no dev deps on server)
npm ci --ignore-scripts
npm run build

# Copy static assets into the standalone output directory
# (Next.js standalone does not bundle these automatically)
cp -r .next/static  .next/standalone/.next/static
cp -r public        .next/standalone/public
```

### Step 2.7 — PM2 ecosystem config

```bash
cat > /var/www/tundua-frontend/ecosystem.config.js <<'JS'
module.exports = {
  apps: [
    {
      name: 'tundua-frontend',
      script: '/var/www/tundua-frontend/.next/standalone/server.js',
      cwd: '/var/www/tundua-frontend/.next/standalone',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: '127.0.0.1',
      },
    },
  ],
};
JS

pm2 start /var/www/tundua-frontend/ecosystem.config.js
pm2 save

# Run the printed command to enable PM2 on reboot
pm2 startup
```

### Step 2.8 — Nginx server block for `tundua.com`

```bash
cat > /etc/nginx/sites-available/tundua.com <<'NGINX'
server {
    listen 80;
    server_name tundua.com www.tundua.com;

    location /_next/static/ {
        alias /var/www/tundua-frontend/.next/standalone/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /favicon.ico {
        alias /var/www/tundua-frontend/.next/standalone/public/favicon.ico;
    }

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
NGINX

ln -s /etc/nginx/sites-available/tundua.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### Phase 2 verification

```bash
# PM2 process is running
pm2 list | grep tundua-frontend

# Next.js responds on port 3001
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3001

# Nginx proxies correctly (before DNS switch)
curl -s -o /dev/null -w "%{http_code}" -H "Host: tundua.com" http://127.0.0.1
```

---

## Phase 3 — SSL (run AFTER DNS is pointed to the VPS)

```bash
apt install -y certbot python3-certbot-nginx

# Frontend
certbot --nginx -d tundua.com -d www.tundua.com

# Backend API
certbot --nginx -d api.tundua.com

# Confirm auto-renewal timer is active
systemctl status certbot.timer
```

### Phase 3 verification

```bash
curl -s -o /dev/null -w "%{http_code}" https://tundua.com
curl -s -o /dev/null -w "%{http_code}" https://api.tundua.com/health
# Both must return 200
```

---

## Phase 4 — Deployment script

Create `/var/www/tundua-deploy.sh` — run this on every future deployment:

```bash
cat > /var/www/tundua-deploy.sh <<'BASH'
#!/usr/bin/env bash
set -euo pipefail

REPO=/var/www/tundua-repo
BACKEND=/var/www/tundua-backend
FRONTEND=/var/www/tundua-frontend

echo "==> Pulling latest code"
cd "$REPO"
git fetch --all
git reset --hard origin/main

# ── BACKEND ──────────────────────────────────────────────────────────────
echo "==> Installing backend dependencies"
cd "$BACKEND"
composer install --no-dev --optimize-autoloader

echo "==> Running database migrations"
vendor/bin/phinx migrate -e production

echo "==> Fixing permissions"
chown -R www-data:www-data "$BACKEND"
chmod -R 755 "$BACKEND"
chmod -R 775 "$BACKEND/storage"

echo "==> Reloading PHP-FPM"
systemctl reload php8.3-fpm

# ── FRONTEND ─────────────────────────────────────────────────────────────
echo "==> Installing frontend dependencies"
cd "$FRONTEND"
npm ci --ignore-scripts

echo "==> Building frontend"
npm run build

echo "==> Copying static assets into standalone output"
cp -r .next/static  .next/standalone/.next/static
cp -r public        .next/standalone/public

echo "==> Reloading PM2 (zero downtime)"
pm2 reload tundua-frontend

echo ""
echo "Deployment complete"
echo "  Backend:  https://api.tundua.com/health"
echo "  Frontend: https://tundua.com"
BASH

chmod +x /var/www/tundua-deploy.sh
```

---

## Phase 5 — Manual checklist

### Environment variables to fill in

**Backend — `/var/www/tundua-backend/.env`**

- [ ] `DB_PASSWORD` — the strong password chosen in Step 1.2
- [ ] `JWT_SECRET` — `openssl rand -hex 32`
- [ ] `CRON_SECRET` — `openssl rand -hex 24`
- [ ] `MAIL_PASSWORD` — Gmail App Password for `tunduaedu@gmail.com`
- [ ] `PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY`, `PAYSTACK_SCHOLAR_PLAN_CODE` — live keys from Paystack dashboard
- [ ] `PUSHER_APP_ID`, `PUSHER_APP_KEY`, `PUSHER_APP_SECRET`, `PUSHER_APP_CLUSTER`
- [ ] `GA4_MEASUREMENT_ID` + `GA4_API_SECRET` — from GA4 → Data Streams (or leave blank)
- [ ] `VEPAAR_WEBHOOK_URL` — from Vepaar → Integrations (or leave blank)
- [ ] `SESSION_DOMAIN=api.tundua.com`, `SESSION_SECURE=true`, `SESSION_SAME_SITE=none`

**Frontend — `/var/www/tundua-frontend/.env.production`**

- [ ] `NEXT_PUBLIC_PUSHER_KEY` + `NEXT_PUBLIC_PUSHER_CLUSTER` — same values as backend
- [ ] `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_AUTH_TOKEN` — from Sentry (or leave blank)
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` — from PostHog (or leave blank)
- [ ] `ANTHROPIC_API_KEY` — if Visa Assistant AI feature is in use
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — if Google OAuth is in use

---

### Verification before switching DNS

Test the VPS directly from your local machine by spoofing DNS with `curl --resolve`:

```bash
# Backend health (HTTP — before certbot)
curl --resolve api.tundua.com:80:167.233.129.143 \
  http://api.tundua.com/health

# Frontend (HTTP — before certbot)
curl --resolve tundua.com:80:167.233.129.143 \
  -o /dev/null -w "%{http_code}\n" http://tundua.com

# Backend health (HTTPS — after certbot)
curl --resolve api.tundua.com:443:167.233.129.143 \
  https://api.tundua.com/health

# Frontend (HTTPS — after certbot)
curl --resolve tundua.com:443:167.233.129.143 \
  -o /dev/null -w "%{http_code}\n" https://tundua.com
```

All four must return `200` before you change DNS.

---

### DNS changes

Lower your TTL to **300 seconds at least 24 hours before** switching so rollback is fast.

| Record | Type | Value | TTL |
|--------|------|-------|-----|
| `tundua.com` | A | `167.233.129.143` | 300 |
| `www.tundua.com` | A | `167.233.129.143` | 300 |
| `api.tundua.com` | A | `167.233.129.143` | 300 |

---

### Data migration from Syskay (live database)

Before decommissioning Syskay, export and import the live data:

```bash
# On Syskay (via SSH or hosting panel)
mysqldump -u SYSKAY_USER -p SYSKAY_DB > tundua-syskay-export.sql

# Transfer to VPS
scp tundua-syskay-export.sql root@167.233.129.143:/tmp/

# On VPS — import over the migration-only schema
mysql -u tundua_user -p tundua_db < /tmp/tundua-syskay-export.sql
```

---

### When to decommission Vercel and Syskay

- [ ] Keep **Vercel** live until `tundua.com` DNS has pointed to the VPS for **72 hours** with no errors in `pm2 logs tundua-frontend`
- [ ] Keep **Syskay** live until `api.tundua.com` has been on the VPS for **72 hours** and Paystack webhooks are confirmed hitting the new server
- [ ] Complete the Syskay database export and import (above) before removing the Syskay hosting account
- [ ] After removing Vercel, delete the project there to avoid stale environment variable confusion
- [ ] After removing Syskay, cancel the hosting plan and update any saved credentials

---

### Paystack webhook update

After DNS is switched and HTTPS is confirmed working, update the webhook URL in your Paystack dashboard from the old Syskay URL to:

```
https://api.tundua.com/api/payments/paystack/callback
```

---

### Cron jobs

If any cron jobs existed on Syskay (e.g. scheduled tasks hitting the API), recreate them on the VPS:

```bash
crontab -e
# Example: run a cleanup task daily at 2am
# 0 2 * * * curl -s -H "X-Cron-Secret: YOUR_CRON_SECRET" https://api.tundua.com/api/cron/cleanup
```
