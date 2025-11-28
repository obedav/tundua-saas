# 📋 Pre-Deployment Checklist - Tundua SaaS

**Date**: November 27, 2025
**Status**: Preparing for Production

---

## ✅ Required Credentials & Configuration

### 1. **Database Credentials** (Create in cPanel)

```
Database Name: tunduaco_tundua
Database User: tunduaco_tundua_user
Database Password: [Generate strong password in cPanel]
```

**Action Steps:**

1. Log into cPanel: https://tundua.com:2083
2. Go to **MySQL® Databases**
3. Create database: `tunduaco_tundua`
4. Create user: `tunduaco_tundua_user`
5. Generate strong password (minimum 16 characters)
6. Add user to database with ALL PRIVILEGES
7. **Copy password** to update in `.env` file

---

### 2. **Email Service** (Gmail App Password)

```
MAIL_USERNAME: [Your Gmail address]
MAIL_PASSWORD: [Gmail App Password]
```

**Action Steps:**

1. Go to: https://myaccount.google.com/apppasswords
2. Create app password for "Tundua SaaS"
3. Copy the 16-character password
4. Update `.env.production` file

**Note**: You must have 2-Step Verification enabled on your Google account.

---

### 3. **Stripe Payment Gateway** (Nigerian Naira Support)

```
STRIPE_PUBLIC_KEY: pk_live_[YOUR_KEY]
STRIPE_SECRET_KEY: sk_live_[YOUR_KEY]
STRIPE_WEBHOOK_SECRET: whsec_[AUTO_GENERATED]
```

**Action Steps:**

1. Log into Stripe Dashboard: https://dashboard.stripe.com
2. **Enable Nigerian Naira (NGN)**:
   - Go to Settings → Account
   - Click "Add currency"
   - Select "Nigerian naira (NGN)"
3. **Get Live API Keys**:
   - Go to Developers → API Keys
   - Switch to "Live mode" (toggle in top right)
   - Copy "Publishable key" (starts with `pk_live_`)
   - Reveal and copy "Secret key" (starts with `sk_live_`)
4. **Create Webhook**:
   - Go to Developers → Webhooks
   - Click "+ Add endpoint"
   - Endpoint URL: `https://api.tundua.com/api/payments/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.failed`, `charge.refunded`
   - Copy webhook signing secret (starts with `whsec_`)

**Important**: Start with test mode first, then switch to live after testing!

---

### 4. **Paystack Payment Gateway** (Primary for Nigeria)

```
PAYSTACK_PUBLIC_KEY: pk_live_[YOUR_KEY]
PAYSTACK_SECRET_KEY: sk_live_[YOUR_KEY]
```

**Action Steps:**

1. Sign up at: https://paystack.com
2. Complete KYC verification
3. Go to Settings → API Keys & Webhooks
4. Copy Live Public Key
5. Copy Live Secret Key
6. **Setup Webhook**:
   - Webhook URL: `https://api.tundua.com/api/payments/paystack/callback`
   - Enable events: `charge.success`, `charge.failed`, `refund.processed`

**Why Paystack?**

- Lower fees for Nigerian transactions (1.5% vs Stripe's 3.9%)
- Local bank settlement
- Better for NGN payments

---

### 5. **Pusher Real-Time Notifications**

```
PUSHER_APP_ID: [YOUR_APP_ID]
PUSHER_APP_KEY: [YOUR_KEY]
PUSHER_APP_SECRET: [YOUR_SECRET]
PUSHER_APP_CLUSTER: eu
```

**Action Steps:**

1. Sign up at: https://pusher.com
2. Create new app: "Tundua Production"
3. Select cluster: **Europe (eu)** (closest to Nigeria)
4. Copy App ID, Key, Secret
5. Enable client events (for real-time features)

**Free Plan Limits**:

- 200,000 messages/day
- 100 concurrent connections
- Sufficient for initial launch

---

### 6. **Twilio SMS/WhatsApp** (Optional - For Phase 2)

```
TWILIO_ACCOUNT_SID: [YOUR_SID]
TWILIO_AUTH_TOKEN: [YOUR_TOKEN]
TWILIO_PHONE_NUMBER: [YOUR_NUMBER]
```

**Action Steps:**

1. Sign up at: https://www.twilio.com
2. Get Nigerian phone number
3. Copy Account SID and Auth Token
4. Enable WhatsApp Business API

**Note**: This is optional for Phase 1. You can add it later for SMS notifications.

---

## 📁 Files to Upload to cPanel

### Backend Files Structure:

```
/home2/tunduaco/api.tundua.com/
├── public/
│   ├── index.php
│   └── .htaccess
├── src/
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   └── Middleware/
├── database/
│   └── migrations/
├── vendor/ (composer install on server)
├── .env (renamed from .env.production)
└── composer.json
```

### Files to Exclude from Upload:

- `tests/`
- `.phpunit.cache/`
- `phpunit.xml`
- `*.md` files
- `test-*.php` files
- `check-*.php` files
- `.env.example`
- `.git/` (if using Git)

---

## 🔐 Security Keys Generated

### ✅ JWT Secret (Already Generated):

```
JWT_SECRET=42vMWSwJnL7OlokW4YZWIWoJ6gt0EAvFWuz5t/BXo0M=
```

### ✅ Stripe Webhook Secret (Placeholder):

```
STRIPE_WEBHOOK_SECRET=whsec_1ec3f50b1c1d3b83562d09066d952680db68c7db4f40e0018bde0cc44981eb98
```

**Note**: Replace this with actual Stripe webhook secret after creating webhook.

### ⚠️ Cron Job Secret (Generate Now):

Run this command locally:

```bash
openssl rand -hex 32
```

Copy output and update `.env.production`:

```
CRON_SECRET=[YOUR_GENERATED_SECRET]
```

---

## 📊 Database Migrations (Upload Order)

Upload these files to MySQL via phpMyAdmin in this exact order:

1. ✅ `create_users_table.sql`
2. ✅ `create_service_tiers_table.sql`
3. ✅ `create_addon_services_table.sql`
4. ✅ `create_applications_table.sql`
5. ✅ `create_documents_table.sql`
6. ✅ `create_payments_table.sql`
7. ✅ `create_refunds_table.sql`
8. ✅ `create_activities_table.sql`
9. ✅ `create_referrals_table.sql`
10. ✅ `create_audit_logs_table.sql`

**Location**: `backend/database/migrations/`

---

## 🌐 DNS Configuration

### Required DNS Records:

| Type  | Name | Value                   | TTL  |
| ----- | ---- | ----------------------- | ---- |
| A     | @    | 76.76.21.21 (Vercel)    | 3600 |
| CNAME | www  | cname.vercel-dns.com    | 3600 |
| A     | api  | 148.251.20.169 (Syskay) | 3600 |

**Where to Configure:**

- Log into your domain registrar (where you bought tundua.com)
- Go to DNS Management
- Add the records above

---

## ✅ Pre-Flight Checklist

Before deploying, ensure you have:

### Credentials:

- [ ] Database password (from cPanel)
- [ ] Gmail app password
- [ ] Stripe live API keys
- [ ] Stripe webhook secret
- [ ] Paystack live API keys
- [ ] Pusher credentials
- [ ] Cron job secret generated

### Files Prepared:

- [ ] `.env.production` file updated with all credentials
- [ ] Development files removed from backend
- [ ] Database migration files ready
- [ ] Frontend `.env.production` created

### Access:

- [ ] cPanel login credentials (tunduaco)
- [ ] FTP/SFTP credentials (if needed)
- [ ] Vercel account created
- [ ] GitHub repository ready (for Vercel deployment)

### Domain:

- [ ] DNS access to domain registrar
- [ ] tundua.com domain verified

---

## 🚀 Next Steps

Once all checklist items are completed:

1. **Create database in cPanel** (Step 2 of deployment guide)
2. **Upload backend files** to `/home2/tunduaco/api.tundua.com`
3. **Run database migrations** via phpMyAdmin
4. **Update .env file** on server with credentials
5. **Deploy frontend** to Vercel
6. **Configure DNS** records
7. **Test deployment** end-to-end

---

## 📞 Need Help?

### Payment Gateway Support:

- **Stripe**: https://support.stripe.com
- **Paystack**: https://support.paystack.com

### Hosting Support:

- **Syskay cPanel**: support@syskay.com
- **Vercel**: https://vercel.com/support

### Email Issues:

- **Gmail App Passwords**: https://support.google.com/accounts/answer/185833
