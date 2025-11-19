HEAD

# tundua-saas

# A study abroad saas platform

# Tundua Study Abroad SaaS Platform

A comprehensive study abroad application platform built with **Next.js 14** (frontend) and **PHP Slim 4** (backend). Inspired by the SwiftPass visa platform model, adapted for university applications.

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Revenue Model](#revenue-model)
- [Roadmap](#roadmap)

---

## 🎯 Overview

Tundua is a **full SaaS platform** that helps students apply to universities abroad. Unlike content/marketing sites, this is a transaction-based platform that generates revenue through:

- **Application Packages:** $299-$999 per application
- **Add-On Services:** $18-$399 per service (13+ services)
- **Target Revenue:** $10,000-$50,000/month within 6-12 months

---

## ✨ Features

### Core SaaS Features

- ✅ **User Authentication**

  - JWT-based authentication
  - Email verification
  - Password reset
  - Role-based access (user, admin, super_admin)

- ✅ **6-Step Application Wizard**

  - Personal information
  - Academic background
  - University selection
  - Service tier selection
  - Add-on services
  - Document upload
  - Review & payment

- ✅ **Payment Integration**

  - Stripe Checkout (global payments)
  - M-Pesa (Kenya mobile money)
  - Payment status tracking
  - Receipt generation

- ✅ **Document Management**

  - Secure file upload
  - File validation (type, size)
  - Document verification
  - Status tracking
  - Download/preview

- ✅ **User Dashboard**

  - Application tracking
  - Status updates
  - Document management
  - Payment history
  - Refund requests

- ✅ **Admin Dashboard**

  - Application management
  - Document review
  - Payment tracking
  - Refund processing
  - Analytics
  - User management

- ✅ **Refund Management**

  - E-Agreement signing
  - 90-day countdown
  - Admin approval workflow
  - PDF agreement generation

- ✅ **Notification System**
  - Email notifications (PHPMailer)
  - SMS notifications (Twilio - optional)
  - WhatsApp notifications (Twilio - optional)
  - Automated triggers

---

## 🛠 Tech Stack

### Frontend

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **React Hook Form** - Form management
- **Zod** - Validation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend

- **PHP 8.0+** - Server language
- **Slim Framework 4** - Micro framework
- **MySQL 8.0+** - Database
- **JWT** - Authentication
- **Stripe PHP SDK** - Payments
- **PHPMailer** - Email
- **DomPDF** - PDF generation

### Infrastructure

- **Vercel/Netlify** - Frontend hosting
- **Apache/Nginx** - Backend hosting
- **MySQL** - Database
- **Composer** - PHP dependencies
- **npm** - Node dependencies

---

## 📁 Project Structure

```
tundua-saas/
├── frontend/                # Next.js 14 Frontend
│   ├── src/
│   │   ├── app/            # App router pages
│   │   │   ├── (auth)/     # Auth pages (login, register)
│   │   │   ├── apply/      # Application wizard
│   │   │   ├── dashboard/  # User dashboard
│   │   │   └── admin/      # Admin dashboard
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities (API client, utils)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
│
├── backend/                # PHP Slim 4 Backend
│   ├── config/            # Configuration files
│   ├── public/            # Public directory (entry point)
│   │   └── index.php
│   ├── src/
│   │   ├── Controllers/   # API Controllers
│   │   ├── Models/        # Database Models
│   │   ├── Services/      # Business Logic
│   │   ├── Middleware/    # Middleware
│   │   └── Database/      # DB connection & schema
│   ├── storage/           # File storage
│   │   ├── documents/     # Uploaded documents
│   │   ├── uploads/       # Temp uploads
│   │   └── logs/          # Application logs
│   ├── tests/             # PHPUnit tests
│   ├── composer.json
│   └── .env.example
│
└── README.md              # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **PHP 8.0+** and Composer
- **MySQL 8.0+**
- Git

### 1. Clone the Repository

```bash
cd tundua.com
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
exit;

# Import schema
mysql -u root -p tundua_saas < src/Database/schema.sql

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
cp .env.local.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
# Frontend now running at http://localhost:3000
```

### 4. Access the Platform

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000 (JSON endpoint list)

---

## 📝 Installation (Detailed)

### Backend Installation

1. **Install PHP 8.0+**

   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install php8.0 php8.0-cli php8.0-mbstring php8.0-xml php8.0-mysql php8.0-curl

   # macOS (with Homebrew)
   brew install php@8.0

   # Windows: Download from php.net
   ```

2. **Install Composer**

   ```bash
   curl -sS https://getcomposer.org/installer | php
   sudo mv composer.phar /usr/local/bin/composer
   ```

3. **Install MySQL**

   ```bash
   # Ubuntu/Debian
   sudo apt install mysql-server

   # macOS
   brew install mysql

   # Windows: Download MySQL installer
   ```

4. **Setup Backend**

   ```bash
   cd backend
   composer install
   cp .env.example .env
   # Edit .env file
   ```

5. **Configure Database**

   ```env
   # .env
   DB_HOST=localhost
   DB_DATABASE=tundua_saas
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

6. **Create Database & Import Schema**

   ```bash
   mysql -u root -p
   CREATE DATABASE tundua_saas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   exit;

   mysql -u root -p tundua_saas < src/Database/schema.sql
   ```

7. **Set Permissions**

   ```bash
   chmod -R 775 storage/
   ```

8. **Start Development Server**
   ```bash
   composer start
   # or
   php -S localhost:8000 -t public
   ```

### Frontend Installation

1. **Install Node.js 18+**

   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # macOS
   brew install node@18

   # Windows: Download from nodejs.org
   ```

2. **Setup Frontend**

   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   ```

3. **Configure Environment**

   ```env
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## ⚙️ Configuration

### Backend Configuration (.env)

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

# JWT
JWT_SECRET=generate-random-256-bit-key-here
JWT_EXPIRY=3600

# Stripe
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=noreply@tundua.com

# M-Pesa (Optional)
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=174379
MPESA_PASSKEY=

# Twilio (Optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

### Frontend Configuration (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
NEXT_PUBLIC_ENV=development
```

---

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd backend
composer test

# Frontend tests (to be added)
cd frontend
npm test
```

### Linting

```bash
# Frontend linting
cd frontend
npm run lint
```

### Type Checking

```bash
# Frontend type checking
cd frontend
npm run type-check
```

### Building for Production

```bash
# Backend (no build needed, just deploy files)

# Frontend
cd frontend
npm run build
npm start  # Production server
```

---

## 🚀 Deployment

### Backend Deployment (Apache/Nginx)

1. **Upload files to server**

   ```bash
   scp -r backend user@server:/var/www/tundua-saas/
   ```

2. **Install dependencies**

   ```bash
   ssh user@server
   cd /var/www/tundua-saas/backend
   composer install --no-dev --optimize-autoloader
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   nano .env  # Edit with production values
   ```

4. **Set permissions**

   ```bash
   chmod -R 775 storage/
   chown -R www-data:www-data storage/
   ```

5. **Configure Apache/Nginx**
   See backend/README.md for Apache/Nginx configuration

6. **Setup SSL**
   ```bash
   sudo certbot --apache -d api.tundua.com
   ```

### Frontend Deployment (Vercel)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Go to vercel.com
   - Import GitHub repository
   - Select `frontend` directory as root
   - Add environment variables
   - Deploy

3. **Configure Custom Domain**
   - Add domain in Vercel settings
   - Update DNS records

---

## 💰 Revenue Model

### Service Tiers

1. **Standard Package - $299**

   - 3 university applications
   - Basic document review
   - Email support

2. **Premium Package - $599**

   - 5 university applications
   - Essay review & editing
   - Document verification
   - Priority support

3. **Concierge Package - $999**
   - 8 university applications
   - Complete essay writing
   - Full document preparation
   - Visa assistance
   - Interview coaching
   - Dedicated counselor

### Add-On Services (13 Services)

1. SOP Writing - $150
2. LOR Editing - $75/letter
3. Resume Optimization - $95
4. Scholarship Search - $125
5. Interview Coaching - $200
6. Visa Application Support - $299
7. Document Translation - $50/page
8. IELTS/TOEFL Prep - $399
9. University Selection Report - $149
10. Financial Aid Consulting - $249
11. Post-Landing Support - $199
12. Accommodation Booking - $99
13. Flight Booking Assistance - $75

### Revenue Projections

**Conservative (Month 6):**

- 30 applications/month × $450 avg = $13,500/month
- Annual: ~$150,000

**Optimistic (Month 12):**

- 60 applications/month × $600 avg = $36,000/month
- Annual: ~$430,000

---

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (Completed)

- [x] Project structure setup
- [x] Database schema design
- [x] Basic API endpoints
- [x] Frontend boilerplate
- [x] Service tiers configuration

### 🚧 Phase 2: Authentication (In Progress)

- [ ] User registration
- [ ] Email verification
- [ ] Login/logout
- [ ] Password reset
- [ ] JWT token management

### 📋 Phase 3: Application Wizard (Week 3-5)

- [ ] Step 1: Personal information
- [ ] Step 2: Academic background
- [ ] Step 3: University selection
- [ ] Step 4: Service tier selection
- [ ] Step 5: Add-on services
- [ ] Step 6: Document upload
- [ ] Review & submit

### 💳 Phase 4: Payments (Week 5-6)

- [ ] Stripe integration
- [ ] M-Pesa integration
- [ ] Payment webhooks
- [ ] Receipt generation

### 📄 Phase 5: Documents (Week 6-7)

- [ ] File upload
- [ ] File validation
- [ ] Document verification
- [ ] Status tracking

### 👤 Phase 6: User Dashboard (Week 7-8)

- [ ] Application list
- [ ] Application details
- [ ] Document management
- [ ] Profile settings

### 🔧 Phase 7: Admin Dashboard (Week 8-9)

- [ ] Application management
- [ ] Document review
- [ ] Payment tracking
- [ ] User management
- [ ] Analytics

### 📧 Phase 8: Notifications (Week 9-10)

- [ ] Email templates
- [ ] Email automation
- [ ] SMS notifications (optional)
- [ ] WhatsApp notifications (optional)

### 💸 Phase 9: Refunds (Week 10-11)

- [ ] Refund requests
- [ ] E-Agreement signing
- [ ] PDF generation
- [ ] 90-day countdown
- [ ] Admin approval

### 🚀 Phase 10: Launch (Week 11-12)

- [ ] Testing
- [ ] Bug fixes
- [ ] Security audit
- [ ] Deployment
- [ ] Marketing

---

## 📞 Support

### Documentation

- Backend API: See `backend/README.md`
- Frontend: See `frontend/README.md`
- Transformation Plan: See `TUNDUA_SAAS_TRANSFORMATION_PLAN.md`

### Issues

- Report bugs in GitHub Issues
- Check `/health` endpoint for API status

### Contact

- Email: support@tundua.com
- Website: https://tundua.com

---

## 📄 License

Proprietary - All rights reserved

---

## 🙏 Acknowledgments

- **SwiftPass** - Inspiration for the SaaS model
- **Slim Framework** - Excellent PHP micro framework
- **Next.js** - Amazing React framework
- **Stripe** - Reliable payment processing

---

**Built with ❤️ for students pursuing their dreams of studying abroad**

---

## 📊 Current Status

**Progress: 35% Complete**

- ✅ Project structure
- ✅ Database schema
- ✅ Basic API framework
- ✅ Frontend boilerplate
- ✅ Service tiers data
- 🚧 Authentication (next)
- ⏳ Application wizard
- ⏳ Payments
- ⏳ Documents
- ⏳ Dashboards
- ⏳ Notifications
- ⏳ Refunds

**Next Steps:**

1. Implement authentication system (JWT)
2. Build application wizard backend
3. Integrate Stripe payments
4. Create user dashboard
5. Build admin panel

Ready to transform Tundua into a revenue-generating SaaS platform! 🚀

a9e6c2f (Initial commit)
