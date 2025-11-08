# Tundua SaaS Backend API

PHP-based REST API for the Tundua Study Abroad Application Platform.

## 🚀 Tech Stack

- **PHP 8.0+**
- **Slim Framework 4** - Lightweight PHP framework
- **MySQL 8.0+** - Database
- **JWT** - Authentication
- **Stripe** - Payment processing
- **M-Pesa** - Kenya mobile payments
- **PHPMailer** - Email notifications

## 📁 Project Structure

```
backend/
├── config/               # Configuration files
├── public/              # Public directory (document root)
│   └── index.php        # Application entry point
├── src/
│   ├── Controllers/     # API Controllers
│   ├── Models/          # Database Models
│   ├── Services/        # Business Logic
│   ├── Middleware/      # Middleware (Auth, CORS, etc.)
│   └── Database/        # Database connection & schema
├── storage/
│   ├── documents/       # Uploaded documents
│   ├── uploads/         # Temporary uploads
│   └── logs/            # Application logs
├── tests/               # PHPUnit tests
├── .env.example         # Environment variables template
├── composer.json        # PHP dependencies
└── README.md
```

## 🛠 Installation

### Prerequisites

- PHP 8.0 or higher
- Composer
- MySQL 8.0 or higher
- Web server (Apache/Nginx) or PHP built-in server

### Step 1: Install Dependencies

```bash
cd backend
composer install
```

### Step 2: Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DB_HOST=localhost
DB_DATABASE=tundua_saas
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-256-bit-secret-key

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Email
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Step 3: Database Setup

Create the database:

```bash
mysql -u root -p
CREATE DATABASE tundua_saas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

Import the schema:

```bash
mysql -u root -p tundua_saas < src/Database/schema.sql
```

### Step 4: Permissions

Set proper permissions for storage directories:

```bash
chmod -R 775 storage/
chown -R www-data:www-data storage/  # Linux/Apache
```

### Step 5: Start Development Server

```bash
composer start
# or
php -S localhost:8000 -t public
```

The API will be available at `http://localhost:8000`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email/{token}` - Verify email
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Applications

- `POST /api/applications` - Create new application
- `GET /api/applications` - List user's applications
- `GET /api/applications/{id}` - Get application details
- `PUT /api/applications/{id}` - Update application (draft)
- `POST /api/applications/{id}/submit` - Submit for payment
- `DELETE /api/applications/{id}` - Delete draft
- `POST /api/applications/{id}/calculate` - Calculate pricing

### Documents

- `POST /api/documents/upload` - Upload document
- `GET /api/documents/application/{id}` - List application documents
- `GET /api/documents/{id}` - Get document details
- `GET /api/documents/{id}/download` - Download document
- `DELETE /api/documents/{id}` - Delete document

### Payments

- `POST /api/payments/stripe/create-checkout` - Create Stripe checkout
- `POST /api/payments/stripe/webhook` - Stripe webhook handler
- `POST /api/payments/mpesa/initiate` - Initiate M-Pesa payment
- `POST /api/payments/mpesa/callback` - M-Pesa callback
- `GET /api/payments/{id}` - Get payment status

### Refunds

- `POST /api/refunds` - Request refund
- `GET /api/refunds/user` - List user's refunds
- `GET /api/refunds/{id}` - Get refund details
- `POST /api/refunds/{id}/sign` - Sign E-Agreement
- `GET /api/refunds/{id}/agreement` - Download agreement PDF

### Services

- `GET /api/service-tiers` - List service tiers
- `GET /api/addon-services` - List add-on services

### Admin

- `GET /api/admin/applications` - List all applications
- `PUT /api/admin/applications/{id}/status` - Update status
- `POST /api/admin/applications/{id}/notes` - Add notes
- `GET /api/admin/documents/pending` - Pending documents
- `PUT /api/admin/documents/{id}/review` - Review document
- `GET /api/admin/refunds` - List refunds
- `PUT /api/admin/refunds/{id}/review` - Review refund
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/users` - List users

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Flow:

1. User sends credentials to `/api/auth/login`
2. API returns JWT token and refresh token
3. Client includes token in subsequent requests:
   ```
   Authorization: Bearer {token}
   ```

### Token Expiry:

- Access Token: 1 hour
- Refresh Token: 30 days

## 💳 Payment Integration

### Stripe

1. Create checkout session:
   ```bash
   POST /api/payments/stripe/create-checkout
   {
     "application_id": 123,
     "success_url": "https://app.com/success",
     "cancel_url": "https://app.com/cancel"
   }
   ```

2. Redirect user to Stripe Checkout

3. Handle webhook events at `/api/payments/stripe/webhook`

### M-Pesa (Kenya)

1. Initiate STK Push:
   ```bash
   POST /api/payments/mpesa/initiate
   {
     "application_id": 123,
     "phone_number": "254712345678"
   }
   ```

2. User enters M-Pesa PIN on their phone

3. Callback handled at `/api/payments/mpesa/callback`

## 📧 Email Notifications

Automatic emails are sent for:

- Welcome & email verification
- Application submitted
- Payment received
- Application status updates
- Document approval/rejection
- Refund updates

## 🧪 Testing

```bash
# Run all tests
composer test

# Run specific test
./vendor/bin/phpunit tests/AuthTest.php
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (cost factor 12)
- ✅ JWT token authentication
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS prevention (input sanitization)
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ File upload validation
- ✅ HTTPS enforcement (production)

## 📊 Database

### Key Tables:

- `users` - User accounts
- `user_profiles` - Extended user information
- `applications` - Visa applications
- `documents` - Uploaded documents
- `payments` - Payment transactions
- `refunds` - Refund requests
- `service_tiers` - Service packages
- `addon_services` - Additional services
- `notifications` - Email/SMS tracking
- `activity_log` - Audit trail

## 🚀 Deployment

### Production Checklist:

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Generate strong `JWT_SECRET`
- [ ] Configure production database
- [ ] Setup Stripe live keys
- [ ] Configure email (SMTP)
- [ ] Setup SSL certificate
- [ ] Configure cron jobs
- [ ] Setup backups
- [ ] Enable error logging
- [ ] Test all payment flows

### Cron Jobs:

```bash
# Auto-delete unpaid applications (every 6 hours)
0 */6 * * * php /path/to/backend/cron/cleanup-unpaid.php

# Send payment reminders (daily at 9 AM)
0 9 * * * php /path/to/backend/cron/payment-reminders.php

# Update refund countdown (daily)
0 0 * * * php /path/to/backend/cron/update-refund-countdown.php
```

### Apache Configuration:

```apache
<VirtualHost *:80>
    ServerName api.tundua.com
    DocumentRoot /var/www/tundua-saas/backend/public

    <Directory /var/www/tundua-saas/backend/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/tundua-error.log
    CustomLog ${APACHE_LOG_DIR}/tundua-access.log combined
</VirtualHost>
```

### Nginx Configuration:

```nginx
server {
    listen 80;
    server_name api.tundua.com;
    root /var/www/tundua-saas/backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## 📝 Environment Variables

See `.env.example` for all available configuration options.

**Critical Variables:**

- `DB_*` - Database credentials
- `JWT_SECRET` - Must be 256-bit random string
- `STRIPE_*` - Stripe API keys
- `MAIL_*` - Email configuration

## 🐛 Troubleshooting

### Database Connection Failed

```bash
# Check MySQL is running
sudo systemctl status mysql

# Check credentials in .env
# Test connection manually
mysql -u username -p database_name
```

### Storage Permission Errors

```bash
# Fix permissions
chmod -R 775 storage/
chown -R www-data:www-data storage/
```

### Composer Errors

```bash
# Clear cache
composer clear-cache

# Update dependencies
composer update
```

## 📞 Support

For issues and questions:
- Check the API documentation at `/api/docs`
- Review error logs in `storage/logs/`
- Test endpoints with `/health` check

## 📄 License

Proprietary - All rights reserved.

---

**Tundua SaaS Backend** - Built with PHP 8 & Slim Framework 4
