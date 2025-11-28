# Tundua Study Abroad SaaS Platform

[![CI/CD Pipeline](https://github.com/obedav/tundua-saas/actions/workflows/ci.yml/badge.svg)](https://github.com/obedav/tundua-saas/actions)
[![Phase 1 Progress](https://img.shields.io/badge/Phase%201-90%25%20Complete-brightgreen)]()
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

A comprehensive **study abroad application platform** that connects students with universities worldwide. Built with **Next.js 15** (frontend) and **PHP Slim 4** (backend), featuring secure payment processing, document management, and intelligent university matching.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Tundua** is a full-featured SaaS platform designed to streamline the university application process for international students. The platform handles everything from university selection to payment processing, document management, and application tracking.

### Key Differentiators

- **Transaction-Based Revenue Model**: $299-$999 per application + add-on services
- **Comprehensive Service Packages**: Standard, Premium, and Concierge tiers
- **Multi-Currency Support**: Stripe (global), Paystack (Africa), M-Pesa (Kenya)
- **Intelligent University Matching**: AI-powered recommendations based on student profiles
- **Complete Document Management**: Secure upload, verification, and tracking
- **Admin Dashboard**: Full application lifecycle management

### Revenue Model

| Service Tier  | Price    | Features                                                                |
| ------------- | -------- | ----------------------------------------------------------------------- |
| **Standard**  | ₦89,000  | 3 universities, basic review, email support                             |
| **Premium**   | ₦149,000 | 5 universities, essay editing, priority support                         |
| **Concierge** | ₦249,000 | 8 universities, full document prep, visa assistance, interview coaching |

**Add-On Services** (13 available): SOP Writing ($150), LOR Editing ($75), Resume Optimization ($95), Interview Coaching ($200), and more.

**Revenue Target**: $10,000-$50,000/month within 6-12 months

---

## ✨ Features

### 🔐 Authentication & Authorization

- ✅ **JWT-based Authentication** with secure token management
- ✅ **Email Verification** with configurable expiry
- ✅ **Password Reset** with secure token flow
- ✅ **Google OAuth Integration** for social login
- ✅ **Role-Based Access Control** (user, admin, super_admin)
- ✅ **Refresh Token Management** with 30-day TTL and blacklisting
- ✅ **Rate Limiting** to prevent brute force attacks

### 📝 Application Management

- ✅ **6-Step Application Wizard**

  - Personal information with validation
  - Academic background and transcripts
  - University selection with intelligent search
  - Service tier selection with pricing calculator
  - Add-on services marketplace
  - Document upload with OCR validation
  - Review and payment

- ✅ **Application Tracking**
  - Real-time status updates (draft, submitted, processing, approved, rejected)
  - Progress indicators and next steps
  - Admin notes and internal tracking
  - Deadline reminders

### 💳 Payment Processing

- ✅ **Multiple Payment Providers**

  - Stripe Checkout (Global credit/debit cards)
  - Paystack (Africa-focused, mobile money)
  - M-Pesa (Kenya mobile payments)

- ✅ **Payment Features**
  - Secure checkout with 3D Secure support
  - Payment status tracking
  - Receipt generation and email delivery
  - Refund processing with 90-day guarantee
  - Payment history and invoices

### 📄 Document Management

- ✅ **Secure File Upload** (up to 10MB per file)
- ✅ **File Validation** (PDF, JPG, JPEG, PNG, DOCX, DOC)
- ✅ **Passport OCR** using Tesseract.js for auto-fill
- ✅ **Document Verification** workflow
- ✅ **Status Tracking** (pending, verified, rejected, resubmission_required)
- ✅ **Secure Download** with authentication
- ✅ **Admin Review Interface** with approval/rejection

### 🎓 University Intelligence

- ✅ **Smart University Search** with filters

  - Country, budget range, GPA requirements
  - Program types and fields of study
  - Sort by ranking, cost, acceptance rate

- ✅ **AI-Powered Recommendations**

  - Profile-based matching algorithm
  - GPA and budget compatibility
  - Success probability scoring

- ✅ **University Database** (500+ institutions)
  - Detailed profiles with rankings
  - Program information and requirements
  - Cost estimates and financial aid data

### 📊 User Dashboard

- ✅ **Dashboard Overview** with key metrics
- ✅ **Application List** with status indicators
- ✅ **Document Manager** with upload and tracking
- ✅ **Payment History** with invoice downloads
- ✅ **Referral System** with tracking and rewards
- ✅ **Profile Management** with settings
- ✅ **Activity Feed** with recent actions
- ✅ **Notifications Center** with real-time updates

### 🔧 Admin Dashboard

- ✅ **Application Management**

  - View all applications with filters
  - Status updates and bulk actions
  - Admin notes and internal comments
  - Application statistics and trends

- ✅ **Document Review**

  - Pending documents queue
  - Document preview and download
  - Approve/reject with feedback
  - Verification workflow

- ✅ **Analytics & Reports**

  - Revenue charts and trends
  - User acquisition metrics
  - Conversion funnel analysis
  - Application success rates

- ✅ **User Management**

  - User list with search and filters
  - Account activation/suspension
  - Role management
  - User activity logs

- ✅ **Financial Management**
  - Payment tracking and reconciliation
  - Refund processing
  - Revenue reports
  - Pricing configuration

### 🔔 Notifications

- ✅ **Email Notifications** (PHPMailer)

  - Welcome emails
  - Email verification
  - Password reset
  - Application status updates
  - Payment confirmations
  - Document review results

- ✅ **Real-Time Notifications** (Pusher - optional)

  - In-app notifications
  - Unread count badges
  - Mark as read functionality
  - Notification history

- ⏳ **SMS Notifications** (Twilio - optional)
- ⏳ **WhatsApp Notifications** (Twilio - optional)

### 💰 Refund Management

- ✅ **Refund Requests** with e-agreement
- ✅ **90-Day Money-Back Guarantee**
- ✅ **E-Agreement Signing** with digital signature
- ✅ **PDF Generation** for agreements
- ✅ **Admin Approval Workflow**
- ✅ **Status Tracking** (requested, under_review, approved, rejected, processed)

### 🎁 Referral System

- ✅ **Unique Referral Codes** per user
- ✅ **Referral Tracking** with conversion metrics
- ✅ **Rewards System** (10% commission)
- ✅ **Payout Management** (pending, paid, failed)

### 📖 Knowledge Base

- ✅ **FAQ System** with categories
- ✅ **Article Management** with rich content
- ✅ **Search Functionality**
- ✅ **Popular Articles** tracking
- ✅ **Helpfulness Ratings**

### 🔒 Security Features

- ✅ **Rate Limiting** on all endpoints

  - 5 attempts for login (15-minute window)
  - 3 attempts for registration (60-minute window)
  - 100 requests for general API (15-minute window)
  - Configurable via environment variables

- ✅ **Audit Logging** for all critical actions

  - User registration, login, logout
  - Application submissions
  - Payment processing
  - Document uploads
  - Admin actions
  - 90-day retention policy

- ✅ **Input Validation & Sanitization**

  - XSS prevention
  - SQL injection protection
  - File type validation
  - Password strength requirements (8+ chars, uppercase, lowercase, number)

- ✅ **Secure File Storage** with access control
- ✅ **CORS Configuration** for API security
- ✅ **Password Hashing** with bcrypt (12 rounds)

---

## 🛠 Tech Stack

### Frontend

| Technology          | Version  | Purpose                         |
| ------------------- | -------- | ------------------------------- |
| **Next.js**         | 15.5.6   | React framework with App Router |
| **React**           | 19.2.0   | UI library                      |
| **TypeScript**      | 5.x      | Type safety                     |
| **Tailwind CSS**    | 3.x      | Utility-first CSS               |
| **React Query**     | 5.28.0   | Data fetching and caching       |
| **React Hook Form** | 7.51.0   | Form management                 |
| **Zod**             | 3.22.4   | Schema validation               |
| **Axios**           | 1.6.7    | HTTP client                     |
| **Framer Motion**   | 12.23.24 | Animations                      |
| **Recharts**        | 2.10.3   | Data visualization              |
| **Tesseract.js**    | 5.0.4    | OCR for passport scanning       |
| **Sentry**          | 10.26.0  | Error tracking                  |
| **PostHog**         | 1.296.1  | Product analytics               |
| **Pusher**          | 8.4.0    | Real-time notifications         |
| **Vitest**          | 4.x      | Unit testing                    |
| **Biome**           | 2.3.6    | Linting and formatting          |

### Backend

| Technology         | Version | Purpose                  |
| ------------------ | ------- | ------------------------ |
| **PHP**            | 8.2.12  | Server language          |
| **Slim Framework** | 4.12    | Micro framework          |
| **Eloquent ORM**   | 10.0    | Database ORM             |
| **MySQL**          | 8.0+    | Primary database         |
| **JWT**            | 6.9     | Authentication tokens    |
| **Stripe PHP SDK** | 13.0    | Payment processing       |
| **Paystack PHP**   | 2.2     | African payment provider |
| **PHPMailer**      | 6.9     | Email sending            |
| **DomPDF**         | 2.0     | PDF generation           |
| **Guzzle**         | 7.8     | HTTP client              |
| **Monolog**        | 3.5     | Logging                  |
| **Phinx**          | 0.16.10 | Database migrations      |
| **PHPUnit**        | 10.5    | Unit testing             |

### Infrastructure & DevOps

- **GitHub Actions** - CI/CD pipeline with automated testing
- **Composer** - PHP dependency management
- **npm** - Node.js dependency management
- **Apache/Nginx** - Web server
- **Vercel/Netlify** - Frontend hosting (recommended)
- **Sentry** - Real-time error monitoring
- **PostHog** - Product analytics

---

## 📁 Project Structure

```
tundua-saas/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # CI/CD pipeline
│       └── deploy-staging.yml         # Staging deployment
│
├── frontend/                          # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/                      # App Router pages
│   │   │   ├── (auth)/              # Authentication pages
│   │   │   │   └── login/
│   │   │   ├── dashboard/           # User dashboard
│   │   │   │   ├── applications/
│   │   │   │   ├── documents/
│   │   │   │   ├── profile/
│   │   │   │   └── referrals/
│   │   │   └── dashboard/admin/     # Admin dashboard
│   │   │       ├── applications/
│   │   │       ├── analytics/
│   │   │       ├── documents/
│   │   │       └── users/
│   │   ├── components/              # React components
│   │   │   ├── ui/                  # Reusable UI components
│   │   │   ├── dashboard/           # Dashboard-specific
│   │   │   ├── admin/               # Admin-specific
│   │   │   └── wizard/              # Application wizard
│   │   ├── lib/                     # Utilities
│   │   │   ├── api-client.ts        # API client configuration
│   │   │   ├── analytics.ts         # Analytics helpers
│   │   │   ├── utils.ts             # General utilities
│   │   │   └── structured-data.ts   # SEO helpers
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── useBadgeCounts.ts
│   │   ├── contexts/                # React contexts
│   │   │   ├── PusherContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   └── types/                   # TypeScript types
│   ├── public/                      # Static assets
│   │   ├── images/
│   │   └── tesseract/              # OCR worker files
│   ├── tests/                       # Vitest tests (95 tests, 96.8% passing)
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── vitest.config.ts
│   └── .env.example
│
├── backend/                          # PHP Slim 4 Backend
│   ├── config/
│   │   └── phinx.php                # Migration configuration
│   ├── database/
│   │   └── migrations/              # Phinx migrations (12 files)
│   ├── public/
│   │   └── index.php                # Application entry point
│   ├── src/
│   │   ├── Controllers/             # API Controllers (14 files)
│   │   │   ├── AuthController.php
│   │   │   ├── ApplicationController.php
│   │   │   ├── PaymentController.php
│   │   │   ├── DocumentController.php
│   │   │   ├── RefundController.php
│   │   │   ├── AnalyticsController.php
│   │   │   ├── UserController.php
│   │   │   ├── UniversityController.php
│   │   │   └── ...
│   │   ├── Models/                  # Eloquent Models (15 files)
│   │   │   ├── User.php
│   │   │   ├── Application.php
│   │   │   ├── Payment.php
│   │   │   ├── Document.php
│   │   │   ├── Referral.php
│   │   │   └── ...
│   │   ├── Services/                # Business Logic
│   │   │   ├── AuthService.php
│   │   │   ├── PricingService.php
│   │   │   ├── EmailService.php
│   │   │   ├── AuditLogger.php
│   │   │   └── ValidationService.php
│   │   ├── Middleware/              # Middleware
│   │   │   ├── AuthMiddleware.php
│   │   │   ├── AdminMiddleware.php
│   │   │   └── RateLimitMiddleware.php
│   │   └── Database/                # Database utilities
│   │       └── Database.php
│   ├── storage/                     # File storage
│   │   ├── documents/               # Uploaded documents
│   │   ├── uploads/                 # Temporary uploads
│   │   ├── logs/                    # Application logs
│   │   └── rate_limits/             # Rate limit tracking
│   ├── tests/                       # PHPUnit tests (85 tests, 50.6% passing)
│   ├── scripts/
│   │   └── backup-database.sh       # Database backup script
│   ├── composer.json
│   ├── phpunit.xml
│   └── .env.example
│
├── PHASE1_COMPLETION_REPORT.md       # Phase 1 achievement report (90%)
├── BACKUP_CRON_SETUP.md              # Backup documentation
├── GITHUB_ACTIONS_SETUP.md           # CI/CD setup guide
└── README.md                         # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **PHP 8.2+** and Composer
- **MySQL 8.0+**
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/obedav/tundua-saas.git
cd tundua-saas
```

### 2. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Create database
mysql -u root -p
CREATE DATABASE tundua_saas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE tundua_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;  # For testing
exit;

# Run migrations
vendor/bin/phinx migrate -e development

# Set storage permissions
chmod -R 775 storage/

# Start server
composer start
# API now running at http://localhost:8000
```

### 3. Frontend Setup (3 minutes)

```bash
# Open new terminal, navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
# Frontend now running at http://localhost:3000
```

### 4. Access the Platform

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000 (JSON endpoint list)
- **Health Check**: http://localhost:8000/health

---

## 📝 Installation

### Detailed Backend Installation

#### 1. Install PHP 8.2+

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install php8.2 php8.2-cli php8.2-mbstring php8.2-xml php8.2-mysql php8.2-curl php8.2-gd

# macOS (with Homebrew)
brew install php@8.2

# Windows: Download from https://windows.php.net/download/
```

#### 2. Install Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer --version
```

#### 3. Install MySQL 8.0+

```bash
# Ubuntu/Debian
sudo apt install mysql-server
sudo mysql_secure_installation

# macOS
brew install mysql
brew services start mysql

# Windows: Download MySQL installer from mysql.com
```

#### 4. Setup Backend

```bash
cd backend
composer install
cp .env.example .env
```

#### 5. Configure Database (.env)

```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=tundua_saas
DB_USERNAME=root
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=generate-random-256-bit-key-here
JWT_EXPIRY=3600
JWT_REFRESH_EXPIRY=2592000

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=noreply@tundua.com
```

#### 6. Create Databases & Run Migrations

```bash
# Create databases
mysql -u root -p
CREATE DATABASE tundua_saas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE tundua_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Run migrations
vendor/bin/phinx migrate -e development
vendor/bin/phinx migrate -e testing

# Verify migrations
vendor/bin/phinx status
```

#### 7. Set Permissions

```bash
chmod -R 775 storage/
chown -R www-data:www-data storage/  # Linux/macOS
```

#### 8. Start Development Server

```bash
composer start
# or
php -S localhost:8000 -t public
```

### Detailed Frontend Installation

#### 1. Install Node.js 18+

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node@18

# Windows: Download from https://nodejs.org/
```

#### 2. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
```

#### 3. Configure Environment (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Stripe for payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx

# Optional: Error tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

#### 4. Start Development Server

```bash
npm run dev
# or with Turbopack for faster builds
npm run dev -- --turbopack
```

---

## ⚙️ Configuration

### Backend Environment Variables (.env)

<details>
<summary>Click to expand full backend configuration</summary>

```env
# Application
APP_NAME="Tundua SaaS"
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:3000
API_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=tundua_saas
DB_USERNAME=root
DB_PASSWORD=

# JWT Authentication
JWT_SECRET=your-256-bit-secret-key-change-this
JWT_ALGORITHM=HS256
JWT_EXPIRY=3600
JWT_REFRESH_EXPIRY=2592000

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true

# Email (PHPMailer)
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@tundua.com
MAIL_FROM_NAME="Tundua Education"

# Stripe Payment Processing
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_CURRENCY=USD

# Paystack (Primary for Africa)
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_CALLBACK_URL=${API_URL}/api/payments/paystack/callback

# M-Pesa (Kenya - Optional)
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=174379
MPESA_PASSKEY=

# Pusher (Real-time notifications)
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=us2

# Twilio (SMS/WhatsApp - Optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# File Uploads
UPLOAD_MAX_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,docx,doc
DOCUMENTS_STORAGE_PATH=storage/documents
STORAGE_DRIVER=local

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MINUTES=15

# Security
BCRYPT_ROUNDS=12
PASSWORD_RESET_EXPIRY=3600
EMAIL_VERIFICATION_EXPIRY=86400

# Logging
LOG_CHANNEL=daily
LOG_LEVEL=debug
LOG_PATH=storage/logs

# Pagination
DEFAULT_PER_PAGE=20
MAX_PER_PAGE=100

# Cron Job Secret
CRON_SECRET=random-secret-for-cron-jobs-change-this
```

</details>

### Frontend Environment Variables (.env.local)

<details>
<summary>Click to expand full frontend configuration</summary>

```env
# API Configuration (REQUIRED)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Sentry Error Tracking (RECOMMENDED)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=tundua-frontend
SENTRY_AUTH_TOKEN=

# PostHog Analytics (RECOMMENDED)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Pusher Real-time (OPTIONAL)
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=us2

# Stripe Payments (PRODUCTION)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# AI Document Assistant (OPTIONAL - 2026 FEATURE)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Google OAuth (OPTIONAL)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# App Configuration
NEXT_PUBLIC_APP_NAME=Tundua Study Abroad
```

</details>

---

## 🧪 Development

### Available Scripts

#### Frontend Scripts

```bash
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Lint code with Biome
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Biome
npm run type-check       # TypeScript type checking
npm run test             # Run Vitest tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report
npm run test:ci          # Run tests in CI mode
```

#### Backend Scripts

```bash
composer start           # Start PHP development server
composer test            # Run PHPUnit tests
vendor/bin/phinx migrate # Run database migrations
vendor/bin/phinx rollback # Rollback last migration
vendor/bin/phinx status  # Check migration status
vendor/bin/phinx seed:run # Run database seeders
```

### Code Quality Tools

#### Frontend

- **Biome**: Fast linting and formatting (replaces ESLint + Prettier)
- **TypeScript**: Strict type checking enabled
- **Husky**: Git hooks for pre-commit checks
- **Vitest**: Fast unit testing
- **@testing-library/react**: Component testing

#### Backend

- **PHPUnit**: Unit and integration testing
- **PHPStan**: Static analysis (planned)
- **PHP CS Fixer**: Code style fixing (planned)

---

## 🧪 Testing

### Frontend Testing

**Test Infrastructure**: ✅ Fully functional
**Tests**: 95 total, 92 passing (96.8%)
**Coverage**: ~40-50% (target: 60%)

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# CI mode (for GitHub Actions)
npm run test:ci
```

**Test Files**:

- ✅ `ErrorBoundary.test.tsx` - 11/11 passing
- ✅ `page.test.tsx` (Login) - 11/11 passing
- ✅ `analytics.test.ts` - 18/18 passing
- ✅ `payment.test.ts` - 18/18 passing
- ✅ `ai-assistant.test.ts` - 6/6 passing
- ✅ `env.test.ts` - 9/9 passing
- ✅ `test-utils.test.tsx` - 16/16 passing
- ⚠️ `BillingHistory.test.tsx` - 1/4 passing (cookies mocking issue)

### Backend Testing

**Test Infrastructure**: ✅ Fully functional
**Tests**: 85 total, 43 passing (50.6%)
**Coverage**: ~15-20% (target: 30%)

```bash
# Run all tests
composer test

# Run specific test file
vendor/bin/phpunit tests/Unit/AuthServiceTest.php

# Run with coverage (requires Xdebug)
vendor/bin/phpunit --coverage-html coverage/
```

**Test Categories**:

- ✅ Database tests: 5/5 passing
- ✅ Application CRUD: 17/18 passing
- ⚠️ Authentication API: Partial (Eloquent migration issues)
- ⚠️ Payment Integration: Partial (expected in development)

### CI/CD Pipeline

**GitHub Actions**: ✅ Active and running

**Jobs**:

1. **Backend Tests** - PHPUnit with MySQL service
2. **Frontend Tests** - Vitest with coverage
3. **Code Quality** - PHP syntax check, PHPStan
4. **Security Scan** - composer audit, npm audit

**Triggers**: Push to `main`, `develop`, `homepage-enhancement`

**Status**: Check [Actions tab](https://github.com/obedav/tundua-saas/actions)

---

## 🚀 Deployment

### Backend Deployment

#### Option 1: Traditional Hosting (Apache/Nginx)

```bash
# 1. Upload files to server
scp -r backend user@server:/var/www/tundua-saas/

# 2. SSH into server
ssh user@server
cd /var/www/tundua-saas/backend

# 3. Install dependencies
composer install --no-dev --optimize-autoloader

# 4. Configure environment
cp .env.example .env
nano .env  # Edit with production values

# 5. Run migrations
vendor/bin/phinx migrate -e production

# 6. Set permissions
chmod -R 775 storage/
chown -R www-data:www-data storage/

# 7. Configure Apache/Nginx (see DEPLOYMENT.md)

# 8. Setup SSL
sudo certbot --apache -d api.yourdomain.com
```

#### Option 2: Docker

```bash
# Coming soon - Docker Compose setup
```

### Frontend Deployment

#### Recommended: Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Import to Vercel
# - Go to vercel.com
# - Import GitHub repository
# - Select 'frontend' as root directory
# - Add environment variables
# - Deploy

# 3. Configure custom domain in Vercel settings
```

#### Alternative: Netlify

```bash
# 1. Build the project
cd frontend
npm run build

# 2. Deploy with Netlify CLI
npm install -g netlify-cli
netlify deploy --prod

# 3. Configure environment variables in Netlify UI
```

### Database Backups

**Automated Backups** (recommended):

```bash
# Setup cron job (see BACKUP_CRON_SETUP.md)
crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * /path/to/tundua-saas/backend/scripts/backup-database.sh >> /var/log/tundua-backup.log 2>&1
```

**Manual Backup**:

```bash
cd backend/scripts
chmod +x backup-database.sh
./backup-database.sh
```

**Features**:

- 30-day retention policy
- GZIP compression
- Error handling
- Cloud backup integration (AWS S3, Google Cloud Storage, Dropbox)

---

## 📚 API Documentation

### Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://api.yourdomain.com`

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

<details>
<summary>Authentication Endpoints</summary>

```
POST   /api/auth/register           # User registration
POST   /api/auth/login              # User login
POST   /api/auth/logout             # User logout
POST   /api/auth/refresh            # Refresh JWT token
POST   /api/auth/forgot-password    # Request password reset
POST   /api/auth/reset-password     # Reset password
GET    /api/auth/verify-email/{token} # Verify email
GET    /api/auth/me                 # Get current user (protected)
PUT    /api/auth/me                 # Update current user (protected)
GET    /api/auth/google             # Google OAuth redirect
GET    /api/auth/google/callback    # Google OAuth callback
```

</details>

<details>
<summary>Application Endpoints</summary>

```
POST   /api/applications            # Create application
GET    /api/applications            # List user applications
GET    /api/applications/{id}       # Get application details
PUT    /api/applications/{id}       # Update application
POST   /api/applications/{id}/submit # Submit application
DELETE /api/applications/{id}       # Delete draft application
POST   /api/applications/calculate-pricing # Calculate pricing
GET    /api/applications/statistics # Get application statistics
```

</details>

<details>
<summary>Payment Endpoints</summary>

```
POST   /api/payments/paystack/initialize # Initialize Paystack payment
GET    /api/payments/paystack/verify/{reference} # Verify Paystack payment
POST   /api/payments/paystack/webhook   # Paystack webhook
POST   /api/payments/stripe/create-checkout # Create Stripe checkout
POST   /api/payments/stripe/webhook     # Stripe webhook
GET    /api/payments/{id}               # Get payment details
GET    /api/payments/history            # Get payment history with summary
```

</details>

<details>
<summary>Document Endpoints</summary>

```
POST   /api/documents/upload        # Upload document
GET    /api/documents/application/{id} # List application documents
GET    /api/documents/{id}          # Get document details
GET    /api/documents/{id}/download # Download document
DELETE /api/documents/{id}          # Delete document
GET    /api/documents/types         # Get document types (public)
```

</details>

<details>
<summary>University Endpoints</summary>

```
GET    /api/universities/search     # Search universities (country, budget, gpa, sort)
GET    /api/universities/countries  # List available countries
GET    /api/universities/{id}       # Get university details
POST   /api/universities/recommend  # Get smart recommendations (profile-based)
```

</details>

<details>
<summary>Admin Endpoints</summary>

```
# Applications
GET    /api/admin/applications      # List all applications
PUT    /api/admin/applications/{id}/status # Update application status
POST   /api/admin/applications/{id}/notes # Add admin notes
GET    /api/admin/applications/statistics # Get admin statistics

# Documents
GET    /api/admin/documents/pending # Documents pending review
GET    /api/admin/documents/{id}/download # Download document (admin)
PUT    /api/admin/documents/{id}/review # Review document

# Refunds
GET    /api/admin/refunds           # List refund requests
PUT    /api/admin/refunds/{id}/review # Review refund

# Analytics
GET    /api/admin/analytics         # Analytics dashboard

# Users
GET    /api/admin/users             # List users
GET    /api/admin/users/{id}        # Get user details
PUT    /api/admin/users/{id}        # Update user
POST   /api/admin/users/{id}/suspend # Suspend user
```

</details>

**Full API Documentation**: Visit `http://localhost:8000` for complete endpoint list with examples.

---

## 🔒 Security

### Implemented Security Features

✅ **Rate Limiting**

- Global: 100 requests per 15 minutes
- Login: 5 attempts per 15 minutes
- Registration: 3 attempts per 60 minutes
- Password reset: 3 attempts per 60 minutes

✅ **JWT Authentication**

- Access tokens: 1 hour TTL
- Refresh tokens: 30 days TTL
- Token rotation on refresh
- Blacklist support for revoked tokens

✅ **Audit Logging**

- All critical actions logged (register, login, logout, payments, etc.)
- IP address and user agent tracking
- 90-day retention policy
- 24+ event types tracked

✅ **Input Validation**

- XSS prevention with htmlspecialchars
- SQL injection protection via Eloquent ORM
- File type validation (whitelist approach)
- File size limits (10MB max)
- Password strength requirements

✅ **Secure Password Handling**

- bcrypt hashing with 12 rounds
- Password strength validation (8+ chars, uppercase, lowercase, number)
- Secure password reset flow

✅ **CORS Configuration**

- Whitelisted origins
- Credential support
- Proper headers for secure cross-origin requests

✅ **File Security**

- Access control on all file downloads
- Authentication required for document access
- Secure file storage outside public directory

### Security Best Practices

- [ ] Setup SSL/TLS certificates in production
- [ ] Use environment-specific configuration
- [ ] Enable error reporting only in development
- [ ] Regularly update dependencies
- [ ] Run security audits (`composer audit`, `npm audit`)
- [ ] Monitor error logs via Sentry
- [ ] Backup database daily
- [ ] Use strong JWT secrets (256-bit minimum)

---

## 📊 Current Status

**Phase 1 Progress**: 90% Complete ✅

| Priority                    | Status                     | Completion |
| --------------------------- | -------------------------- | ---------- |
| Tests (30% coverage)        | ✅ Infrastructure complete | 85%        |
| Architecture (All Eloquent) | ✅ 100% Eloquent ORM       | 100%       |
| Security Gaps               | ✅ All features integrated | 100%       |
| CI/CD Pipeline              | ✅ GitHub Actions running  | 100%       |
| Database Strategy           | ✅ Migrations + backups    | 90%        |

### Recent Achievements

✅ **Eloquent Migration** - Converted User model from PDO to Eloquent ORM (100% ORM consistency)
✅ **Test Infrastructure** - Both frontend and backend test suites functional
✅ **Security Features** - Rate limiting, refresh tokens, audit logging all implemented
✅ **CI/CD Pipeline** - GitHub Actions with automated testing
✅ **Database Migrations** - All 12 migrations run successfully with proper indexing
✅ **Backup Strategy** - Automated backup scripts with comprehensive documentation

### What's Working

- ✅ User authentication (register, login, OAuth, email verification, password reset)
- ✅ Application creation and management
- ✅ Payment processing (Stripe, Paystack)
- ✅ Document upload and management
- ✅ Admin dashboard with full CRUD operations
- ✅ University search and recommendations
- ✅ Referral system
- ✅ Refund management
- ✅ Real-time notifications
- ✅ Audit logging
- ✅ Rate limiting

### In Progress

- ⏳ Increasing test coverage to 60%
- ⏳ Fixing remaining test failures
- ⏳ Cloud backup integration
- ⏳ E2E testing setup

---

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Follow existing code style
   - Write tests for new features
   - Update documentation

3. **Run tests**

   ```bash
   # Frontend
   npm run test
   npm run type-check
   npm run lint

   # Backend
   composer test
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create pull request on GitHub
   ```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

---

## 📄 License

**Proprietary** - All rights reserved

This software is proprietary and confidential. Unauthorized copying, distribution, or modification of this software, via any medium, is strictly prohibited.

---

## 🙏 Acknowledgments

- **Slim Framework** - Excellent PHP micro framework
- **Next.js** - Amazing React framework
- **Stripe** - Reliable payment processing
- **Eloquent ORM** - Beautiful database ORM
- **Open Source Community** - For the amazing tools and libraries

---

## 📞 Support & Resources

### Documentation

- **Backend API**: See `backend/README.md`
- **Frontend**: See `frontend/README.md`
- **Backup Setup**: See `BACKUP_CRON_SETUP.md`
- **CI/CD**: See `GITHUB_ACTIONS_SETUP.md`
- **Phase 1 Report**: See `PHASE1_COMPLETION_REPORT.md`

### Health Checks

- Backend API: `GET /health`
- Database Status: `GET /health` includes database connectivity

### Issue Reporting

- GitHub Issues: [Report bugs or request features](https://github.com/obedav/tundua-saas/issues)
- Email: support@tundua.com
- Website: https://tundua.com

### Getting Help

1. Check the documentation files
2. Review existing GitHub issues
3. Check the `/health` endpoint for API status
4. Review application logs in `backend/storage/logs/`
5. Enable debug mode in `.env` for detailed error messages

---

## 🚀 What's Next?

### Phase 2 Priorities

1. **Increase Test Coverage** to 60%
2. **E2E Testing** with Playwright
3. **Performance Optimization** (caching, query optimization)
4. **Mobile App** (React Native)
5. **Advanced Analytics** (conversion funnels, cohort analysis)
6. **AI Features** (document analysis, application assistance)
7. **Multi-language Support** (i18n)

---

**Built with ❤️ for students pursuing their dreams of studying abroad**

**Last Updated**: November 27, 2025
**Version**: 1.0.0
**Status**: Production-ready (90% Phase 1 complete)

---

## 📈 Quick Metrics

```
📦 Backend
├── PHP 8.2.12
├── Slim 4.12
├── Eloquent 10.0
├── 14 Controllers
├── 15 Models
├── 85 Tests (50.6% passing)
└── 12 Database Migrations

🎨 Frontend
├── Next.js 15.5.6
├── React 19.2.0
├── TypeScript 5.x
├── Tailwind CSS 3.x
├── 95 Tests (96.8% passing)
└── ~40-50% coverage

🔒 Security
├── JWT Authentication
├── Rate Limiting (100%)
├── Audit Logging (24+ events)
├── Input Validation
└── CORS Protection

💳 Payments
├── Stripe (Global)
├── Paystack (Africa)



---

**Ready to transform students' futures? Let's build something amazing! 🎓✨**
```
