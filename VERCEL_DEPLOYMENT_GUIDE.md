# 🚀 Tundua Frontend - Vercel Deployment Guide

**Last Updated**: November 28, 2025
**Status**: Ready for Deployment

---

## 📋 Prerequisites

✅ Backend API deployed and working at: https://api.tundua.com
✅ Code pushed to GitHub: https://github.com/obedav/tundua-saas
✅ Production environment variables prepared in `.env.production`

---

## 🎯 Step 1: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click **"Sign Up"** or **"Login"**
   - Choose **"Continue with GitHub"**

2. **Import Your Project**
   - Click **"Add New..."** → **"Project"**
   - Select **"Import Git Repository"**
   - Find and select: `obedav/tundua-saas`
   - Click **"Import"**

3. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables**

   Click **"Environment Variables"** and add these:

   **Required Variables:**
   ```env
   NEXT_PUBLIC_API_URL=https://api.tundua.com/api
   NEXT_PUBLIC_APP_URL=https://tundua.com
   NEXT_PUBLIC_APP_NAME=Tundua Study Abroad
   NEXT_PUBLIC_PUSHER_KEY=9482b5b67b0b2822a14d
   NEXT_PUBLIC_PUSHER_CLUSTER=eu
   ```

   **Payment Integration (Use Test Keys First):**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[YOUR_TEST_KEY]
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_15ad1cce4b9e5fd4d9a48f127ee4296cec7dc759
   ```

   **Optional (Leave Empty for Now):**
   ```env
   NEXT_PUBLIC_SENTRY_DSN=
   NEXT_PUBLIC_POSTHOG_KEY=
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=
   ```

   **Important:** Set all variables to **"Production"** environment

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-5 minutes for build to complete
   - You'll get a URL like: `tundua-saas-xxx.vercel.app`

---

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Navigate to project
cd C:\Users\obeda\Desktop\tundua-saas

# Deploy to production
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Select your account]
# - Link to existing project? No
# - Project name? tundua-saas
# - Directory? frontend
# - Override build settings? No
```

Then add environment variables via dashboard as described in Option A.

---

## 🌐 Step 2: Configure Custom Domain

### 2.1 Add Domain to Vercel

1. In Vercel Dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add domains:
   - `tundua.com`
   - `www.tundua.com`
4. Vercel will show DNS records to configure

### 2.2 Configure DNS (at your domain registrar)

**For Root Domain (tundua.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Keep Existing API Subdomain:**
```
Type: A
Name: api
Value: 148.251.20.169
TTL: 3600
```

### 2.3 Verify DNS

Wait 5-60 minutes for DNS propagation, then check:
```bash
nslookup tundua.com
nslookup www.tundua.com
nslookup api.tundua.com
```

---

## ✅ Step 3: Verify Deployment

### 3.1 Test Frontend

1. Visit your Vercel URL: `https://tundua-saas-xxx.vercel.app`
2. Check homepage loads correctly
3. Test animations and interactions
4. Click **"Start Free Application"**
5. Try registering a test account
6. Verify login works
7. Check dashboard loads

### 3.2 Test API Integration

Open browser console (F12) and check:
- ✅ No CORS errors
- ✅ API calls to `https://api.tundua.com/api/*` work
- ✅ Authentication works
- ✅ Dashboard data loads

### 3.3 Test Core Features

- [ ] User registration
- [ ] Email verification (check inbox)
- [ ] Login/logout
- [ ] Dashboard access
- [ ] Create new application
- [ ] Document upload
- [ ] Payment flow (test mode)
- [ ] Real-time notifications (if Pusher configured)

---

## 🔧 Step 4: Build Optimization

### Disable Features Temporarily (Optional)

If you encounter build issues, you can disable optional features:

**Create `frontend/.env.vercel`:**
```env
# Disable Sentry during build
SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING=1
SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING=1

# Disable type checking during build (temporary)
NEXT_DISABLE_TYPE_CHECK=1
```

Add this to Vercel environment variables if needed.

---

## 📊 Step 5: Production Checklist

Before switching to live payments:

- [ ] Frontend deployed to Vercel
- [ ] Custom domain configured (tundua.com)
- [ ] SSL certificate active (automatic via Vercel)
- [ ] All pages loading correctly
- [ ] API integration working
- [ ] User authentication working
- [ ] Dashboard functional
- [ ] Test payment flow works (test mode)
- [ ] Email delivery working
- [ ] Mobile responsive on all pages

**Then switch to live payments:**
1. Get Stripe live keys from https://dashboard.stripe.com
2. Get Paystack live keys from https://dashboard.paystack.com
3. Update Vercel environment variables
4. Redeploy: `vercel --prod` or trigger via dashboard

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `Module not found` or dependency errors

**Fix:**
```bash
# Clear cache and redeploy
vercel --force
```

Or in Vercel Dashboard:
- Settings → General → "Clear Cache"
- Then redeploy

---

### CORS Errors

**Error:** `Access to fetch blocked by CORS policy`

**Fix:** Verify backend `.env` has:
```env
CORS_ALLOWED_ORIGINS=https://tundua.com,https://www.tundua.com,https://tundua-saas-xxx.vercel.app
```

Add your Vercel preview URL to allowed origins for testing.

---

### Environment Variables Not Working

**Fix:**
1. Verify all `NEXT_PUBLIC_*` variables are set
2. Check they're set to "Production" environment
3. Redeploy after adding variables
4. Clear browser cache

---

### API Connection Failed

**Checklist:**
- ✅ Backend is running at https://api.tundua.com
- ✅ `NEXT_PUBLIC_API_URL` is set correctly
- ✅ CORS is configured on backend
- ✅ SSL certificate is active on both domains

---

## 🎉 Success!

Once deployed, your platform will be live at:

- **Frontend**: https://tundua.com
- **Backend API**: https://api.tundua.com
- **Admin Dashboard**: https://tundua.com/dashboard/admin

### Next Steps After Deployment:

1. **Create Admin Account**
   ```bash
   # SSH into backend server
   php backend/make-admin.php admin@tundua.com
   ```

2. **Switch to Live Payment Keys**
   - Update Stripe and Paystack keys in Vercel
   - Test a real transaction with small amount

3. **Setup Monitoring**
   - Sentry for error tracking: https://sentry.io
   - PostHog for analytics: https://posthog.com
   - Vercel Analytics (automatic)

4. **Marketing Launch**
   - Announce on social media
   - Send to mailing list
   - SEO optimization
   - Google Ads campaign

---

**Deployment Status**: ✅ Ready
**Deployed by**: Claude Code
**Date**: November 28, 2025
