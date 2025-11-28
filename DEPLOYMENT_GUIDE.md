# 🚀 Tundua SaaS Platform - Production Deployment Guide

**Last Updated**: November 27, 2025
**Deployment Status**: Ready for Production

---

## 📋 **Deployment Overview**

### **Architecture**:
- **Backend**: PHP 8.1+ on Syskay cPanel (api.tundua.com)
- **Frontend**: Next.js on Vercel (tundua.com)
- **Database**: MySQL 8.0 on cPanel
- **SSL**: Free Let's Encrypt (via cPanel)

### **Hosting Details**:
- **Domain**: tundua.com
- **cPanel User**: tunduaco
- **Server IP**: 148.251.20.169
- **Home Directory**: /home2/tunduaco

---

## 🎯 **Pre-Deployment Checklist**

### **1. Backend Requirements**:
- ✅ PHP 8.1 or higher
- ✅ Composer 2.x
- ✅ MySQL 8.0+
- ✅ OpenSSL extension
- ✅ PDO MySQL extension
- ✅ mbstring extension
- ✅ JSON extension

### **2. Environment Variables Ready**:
- ✅ Database credentials
- ✅ JWT secret key
- ✅ Stripe API keys
- ✅ Pusher credentials
- ✅ Email service credentials
- ✅ CORS allowed origins

---

## 📦 **STEP 1: Prepare Backend for Deployment**

### **1.1 Clean Development Files**

```bash
# Navigate to backend directory
cd backend

# Remove development files
rm -rf .phpunit.cache/
rm -rf tests/
rm -f phpunit.xml
rm -f .env.test
rm -f test-*.php
rm -f check-*.php
rm -f fix-*.php
rm -f run-*.php
rm -f nul
rm -f *_BACKUP*.php
rm -f *_NEW*.php
```

### **1.2 Optimize Composer Dependencies**

```bash
# Install production dependencies only
composer install --no-dev --optimize-autoloader

# Dump optimized autoloader
composer dump-autoload --optimize --classmap-authoritative
```

### **1.3 Create Production .env**

Create `backend/.env.production`:

```env
# Application
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.tundua.com

# Database
DB_HOST=localhost
DB_NAME=tunduaco_tundua
DB_USER=tunduaco_tundua_user
DB_PASSWORD=[GENERATE_STRONG_PASSWORD]

# JWT Authentication
JWT_SECRET=[GENERATE_256_BIT_KEY]
JWT_ACCESS_EXPIRY=3600
JWT_REFRESH_EXPIRY=2592000

# CORS
CORS_ALLOWED_ORIGINS=https://tundua.com,https://www.tundua.com

# Stripe Payment
STRIPE_SECRET_KEY=sk_live_[YOUR_LIVE_KEY]
STRIPE_PUBLISHABLE_KEY=pk_live_[YOUR_LIVE_KEY]
STRIPE_WEBHOOK_SECRET=whsec_[YOUR_WEBHOOK_SECRET]

# Pusher (Real-time)
PUSHER_APP_ID=[YOUR_APP_ID]
PUSHER_KEY=[YOUR_KEY]
PUSHER_SECRET=[YOUR_SECRET]
PUSHER_CLUSTER=eu

# Email Service
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=[YOUR_EMAIL]
MAIL_PASSWORD=[YOUR_APP_PASSWORD]
MAIL_FROM_ADDRESS=noreply@tundua.com
MAIL_FROM_NAME=Tundua

# File Upload
MAX_UPLOAD_SIZE=10485760
UPLOAD_PATH=/home2/tunduaco/uploads

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW=3600

# Logging
LOG_PATH=/home2/tunduaco/logs
LOG_LEVEL=error
```

### **1.4 Generate Secure Keys**

```bash
# Generate JWT secret (256-bit)
openssl rand -base64 32

# Generate webhook secret
openssl rand -hex 32
```

---

## 🗄️ **STEP 2: Setup MySQL Database**

### **2.1 Create Database via cPanel**

1. Log into cPanel: https://tundua.com:2083
2. Go to **MySQL® Databases**
3. Create database: `tunduaco_tundua`
4. Create user: `tunduaco_tundua_user`
5. Generate strong password (save it!)
6. Add user to database with **ALL PRIVILEGES**

### **2.2 Upload Database Schema**

Option A: Via cPanel phpMyAdmin
1. Go to **phpMyAdmin** in cPanel
2. Select `tunduaco_tundua` database
3. Click **Import**
4. Upload each migration file in order:

```
backend/database/migrations/
├── create_users_table.sql
├── create_service_tiers_table.sql
├── create_addon_services_table.sql
├── create_applications_table.sql
├── create_documents_table.sql
├── create_payments_table.sql
├── create_refunds_table.sql
├── create_activities_table.sql
├── create_referrals_table.sql
└── create_audit_logs_table.sql
```

Option B: Via SSH (if available)
```bash
mysql -u tunduaco_tundua_user -p tunduaco_tundua < backend/database/migrations/create_users_table.sql
mysql -u tunduaco_tundua_user -p tunduaco_tundua < backend/database/migrations/create_service_tiers_table.sql
# ... repeat for all migrations
```

### **2.3 Seed Initial Data**

```sql
-- Insert service tiers (Naira pricing)
INSERT INTO service_tiers (name, description, base_price, processing_time, features, is_active) VALUES
('Basic', 'Essential application processing', 89000.00, '14-21 days', '["Document Review", "Basic Application", "Email Support"]', 1),
('Standard', 'Priority processing with guidance', 149000.00, '7-14 days', '["Priority Processing", "Document Review", "Application Guidance", "Email + Chat Support"]', 1),
('Premium', 'White-glove service with expert support', 249000.00, '3-7 days', '["Express Processing", "Expert Review", "Personal Consultant", "Interview Prep", "24/7 Support"]', 1);

-- Insert popular add-on services
INSERT INTO addon_services (name, description, price, category, is_active) VALUES
('Document Translation', 'Professional translation of academic documents', 25000.00, 'documentation', 1),
('Visa Application Support', 'Complete visa application assistance', 50000.00, 'visa', 1),
('Interview Preparation', '1-on-1 mock interview coaching', 35000.00, 'consultation', 1),
('SOP Writing', 'Statement of Purpose professional writing', 40000.00, 'documentation', 1);
```

---

## 🌐 **STEP 3: Deploy Backend to cPanel**

### **3.1 Create Subdomain**

1. In cPanel, go to **Subdomains**
2. Create subdomain: `api`
3. Document root: `/home2/tunduaco/api.tundua.com`

### **3.2 Upload Backend Files**

Option A: Via File Manager (Small files)
1. Compress backend folder locally: `backend.zip`
2. Upload to `/home2/tunduaco/api.tundua.com`
3. Extract in File Manager

Option B: Via FTP (Recommended)
1. Use FileZilla or similar
2. Host: tundua.com
3. Username: tunduaco
4. Port: 21
5. Upload backend folder contents to `/home2/tunduaco/api.tundua.com`

Option C: Via Git (Best)
```bash
# SSH into server (if available)
cd /home2/tunduaco
git clone https://github.com/YOUR_USERNAME/tundua-saas.git
cp -r tundua-saas/backend/* api.tundua.com/
cd api.tundua.com
composer install --no-dev --optimize-autoloader
```

### **3.3 Configure File Permissions**

```bash
# Set correct permissions
chmod 755 /home2/tunduaco/api.tundua.com
chmod 755 /home2/tunduaco/api.tundua.com/public
chmod 644 /home2/tunduaco/api.tundua.com/public/.htaccess
chmod 600 /home2/tunduaco/api.tundua.com/.env

# Create writable directories
mkdir -p /home2/tunduaco/logs
mkdir -p /home2/tunduaco/uploads
chmod 755 /home2/tunduaco/logs
chmod 755 /home2/tunduaco/uploads
```

### **3.4 Configure .htaccess**

Create `/home2/tunduaco/api.tundua.com/public/.htaccess`:

```apache
# Enable rewrite engine
RewriteEngine On

# Redirect to index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [QSA,L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Prevent directory listing
Options -Indexes

# Set PHP values
php_value upload_max_filesize 10M
php_value post_max_size 10M
php_value max_execution_time 300
php_value memory_limit 256M
</apache>
```

### **3.5 Setup SSL Certificate**

1. In cPanel, go to **SSL/TLS Status**
2. Select `api.tundua.com`
3. Click **Run AutoSSL**
4. Wait for certificate installation

---

## 🎨 **STEP 4: Deploy Frontend to Vercel**

### **4.1 Prepare Frontend**

```bash
cd frontend

# Create production .env
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://api.tundua.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[YOUR_KEY]
NEXT_PUBLIC_PUSHER_KEY=[YOUR_KEY]
NEXT_PUBLIC_PUSHER_CLUSTER=eu
NEXT_PUBLIC_APP_URL=https://tundua.com
EOF

# Test build locally
npm run build
npm start
```

### **4.2 Deploy to Vercel**

Option A: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

Option B: Via GitHub (Recommended)
1. Push code to GitHub
2. Go to https://vercel.com
3. Click **Import Project**
4. Select your GitHub repository
5. Configure:
   - **Framework**: Next.js
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Add environment variables from `.env.production`
7. Click **Deploy**

### **4.3 Configure Custom Domain**

1. In Vercel project settings, go to **Domains**
2. Add domain: `tundua.com`
3. Add domain: `www.tundua.com`
4. Follow DNS configuration instructions

---

## 🔗 **STEP 5: Configure DNS**

### **5.1 DNS Records**

In your domain registrar (Namecheap, GoDaddy, etc.):

```
# Main domain → Vercel
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

# WWW subdomain → Vercel
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600

# API subdomain → Syskay cPanel
Type: A
Name: api
Value: 148.251.20.169
TTL: 3600
```

### **5.2 Verify DNS Propagation**

```bash
# Check DNS
nslookup tundua.com
nslookup api.tundua.com

# Wait for propagation (up to 48 hours, usually < 1 hour)
```

---

## ✅ **STEP 6: Test Production Deployment**

### **6.1 Test Backend API**

```bash
# Health check
curl https://api.tundua.com/health

# Register test user
curl -X POST https://api.tundua.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "Test123!@#"
  }'

# Login
curl -X POST https://api.tundua.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

### **6.2 Test Frontend**

1. Visit https://tundua.com
2. Test homepage animations
3. Click "Start Free Application"
4. Complete registration
5. Verify email (check inbox)
6. Login to dashboard
7. Start new application
8. Upload documents
9. Test payment flow (use Stripe test mode first!)

### **6.3 Test Email Delivery**

- Register new user → Check verification email
- Forgot password → Check reset email
- Document upload → Check notification email
- Payment success → Check receipt email

---

## 🔒 **STEP 7: Security Hardening**

### **7.1 Backend Security**

```bash
# Disable directory listing
echo "Options -Indexes" >> /home2/tunduaco/api.tundua.com/.htaccess

# Protect sensitive files
cat >> /home2/tunduaco/api.tundua.com/.htaccess << EOF
<FilesMatch "^\.env">
    Order allow,deny
    Deny from all
</FilesMatch>
EOF

# Enable HTTPS only
# Update backend/.env
FORCE_HTTPS=true
```

### **7.2 Database Security**

```sql
-- Revoke unnecessary privileges
REVOKE ALL PRIVILEGES ON tunduaco_tundua.* FROM 'tunduaco_tundua_user'@'localhost';

-- Grant only necessary privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON tunduaco_tundua.* TO 'tunduaco_tundua_user'@'localhost';

FLUSH PRIVILEGES;
```

### **7.3 Setup Monitoring**

1. Enable cPanel error logs
2. Setup Vercel analytics
3. Configure Stripe webhooks
4. Setup Pusher monitoring
5. Enable email delivery monitoring

---

## 📊 **STEP 8: Post-Deployment Checklist**

### **Essential Checks**:

- [ ] Backend API responding at https://api.tundua.com
- [ ] Frontend loading at https://tundua.com
- [ ] SSL certificates active (both domains)
- [ ] Database connection working
- [ ] User registration working
- [ ] Email delivery working
- [ ] Login/logout working
- [ ] Dashboard accessible
- [ ] Application creation working
- [ ] Document upload working
- [ ] Stripe payment working (test mode)
- [ ] Pusher real-time notifications working
- [ ] Mobile responsive design working
- [ ] Homepage animations working
- [ ] All links functional

### **Performance Checks**:

- [ ] Lighthouse score > 90 (desktop)
- [ ] Lighthouse score > 85 (mobile)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] No console errors
- [ ] No broken images/links

### **Security Checks**:

- [ ] HTTPS enforced (both domains)
- [ ] Security headers present
- [ ] .env files protected
- [ ] Rate limiting active
- [ ] CORS configured correctly
- [ ] SQL injection protection tested
- [ ] XSS protection active

---

## 🔧 **Common Issues & Fixes**

### **Issue: 500 Internal Server Error**

```bash
# Check PHP error logs
tail -f /home2/tunduaco/logs/error_log

# Check file permissions
chmod 755 public/
chmod 644 public/index.php

# Regenerate autoloader
composer dump-autoload --optimize
```

### **Issue: Database Connection Failed**

```bash
# Verify credentials in .env
DB_HOST=localhost (not 127.0.0.1)
DB_NAME=tunduaco_tundua
DB_USER=tunduaco_tundua_user
DB_PASSWORD=[check cPanel]

# Test connection
php -r "new PDO('mysql:host=localhost;dbname=tunduaco_tundua', 'tunduaco_tundua_user', 'PASSWORD');"
```

### **Issue: CORS Errors**

```php
// Update backend/.env
CORS_ALLOWED_ORIGINS=https://tundua.com,https://www.tundua.com

// Clear cache
composer dump-autoload
```

### **Issue: File Upload Failing**

```bash
# Check upload directory permissions
chmod 755 /home2/tunduaco/uploads

# Check PHP settings in .htaccess
php_value upload_max_filesize 10M
php_value post_max_size 10M
```

---

## 📞 **Support Contacts**

### **Hosting Support**:
- **Syskay cPanel**: support@syskay.com
- **Vercel**: https://vercel.com/support

### **Service Support**:
- **Stripe**: https://support.stripe.com
- **Pusher**: https://support.pusher.com

---

## 🎉 **Deployment Complete!**

Your Tundua SaaS platform is now live:

- **Frontend**: https://tundua.com
- **Backend API**: https://api.tundua.com
- **Admin Dashboard**: https://tundua.com/dashboard/admin

**Next Steps**:
1. Switch Stripe to live mode
2. Setup backup automation
3. Configure monitoring alerts
4. Create admin user
5. Load initial data (universities, countries)
6. Launch marketing campaign! 🚀

---

**Deployed by**: Claude Code
**Date**: November 27, 2025
**Status**: ✅ Production Ready
