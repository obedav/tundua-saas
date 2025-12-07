# 🚨 CRITICAL SECURITY BREACH - IMMEDIATE ACTION REQUIRED

GitGuardian detected exposed secrets in your GitHub repository. **ACT IMMEDIATELY!**

## ⚠️ EXPOSED CREDENTIALS (Must be rotated NOW!)

### 1. **Database Password** ❌ COMPROMISED
- **Location:** `backend/.env.production.backup`
- **Exposed:** Database password
- **ACTION:**
  - Log into cPanel/hosting provider
  - Change MySQL user password immediately
  - Update password in your server's actual .env file (NOT in git)

### 2. **Gmail SMTP Credentials** ❌ COMPROMISED
- **Email:** gbengageorge10@gmail.com
- **App Password:** Exposed
- **ACTION:**
  1. Go to https://myaccount.google.com/apppasswords
  2. Revoke the exposed app password
  3. Generate a new app password
  4. Update in server's .env file (NOT in git)
  5. Consider enabling 2FA if not already enabled

### 3. **Pusher Credentials** ❌ COMPROMISED
- **App ID:** 2084092
- **App Secret:** Exposed
- **ACTION:**
  1. Go to https://dashboard.pusher.com
  2. Navigate to your app settings
  3. Click "Regenerate credentials"
  4. Update both backend and frontend with new credentials

### 4. **Paystack Secret Key** ❌ COMPROMISED (Test mode)
- **Action:**
  1. Go to https://dashboard.paystack.com/settings/developer
  2. Roll/regenerate your API keys
  3. Update backend .env with new secret key
  4. Update frontend with new public key (if changed)

### 5. **JWT Secret** ❌ COMPROMISED
- **ACTION:**
  ```bash
  # Generate new JWT secret
  openssl rand -base64 32
  ```
  - Update in backend .env
  - **WARNING:** This will invalidate all existing user sessions

### 6. **Stripe Webhook Secret** ❌ COMPROMISED
- **ACTION:**
  1. Go to https://dashboard.stripe.com/webhooks
  2. Delete old webhook endpoint or regenerate secret
  3. Update in backend .env

---

## ✅ COMPLETED ACTIONS

- [x] Removed `.env.production.backup` and `.env.production` from git tracking
- [x] Updated .gitignore to prevent future commits
- [ ] **NEXT:** Remove from git history (see below)
- [ ] **NEXT:** Rotate ALL credentials (see above)
- [ ] **NEXT:** Force push cleaned history

---

## 🔧 STEP 3: Remove Secrets from Git History

We need to remove the secrets from all git history. Choose ONE method:

### Method 1: BFG Repo-Cleaner (RECOMMENDED - Faster)

```bash
# 1. Download BFG
# Visit: https://rtyley.github.io/bfg-repo-cleaner/
# Or use: choco install bfg-repo-cleaner (Windows)

# 2. Create a fresh clone
cd ..
git clone --mirror https://github.com/obedav/tundua-saas.git tundua-saas-clean

# 3. Run BFG to remove the files
java -jar bfg.jar --delete-files ".env.production.backup" tundua-saas-clean
java -jar bfg.jar --delete-files ".env.production" tundua-saas-clean

# 4. Clean up
cd tundua-saas-clean
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. Force push
git push --force
```

### Method 2: git filter-repo (Alternative)

```bash
# Install git-filter-repo
pip install git-filter-repo

# Remove files from history
git filter-repo --path backend/.env.production.backup --invert-paths
git filter-repo --path frontend/.env.production --invert-paths

# Force push
git push --force origin main
```

### Method 3: Manual git filter-branch (Slowest)

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env.production.backup frontend/.env.production" \
  --prune-empty --tag-name-filter cat -- --all

git push --force --all origin
```

---

## 🛡️ STEP 4: Verify Secrets Are Removed

After cleaning history:

```bash
# Search for any remaining secrets
git log --all --full-history --source -- "*env*"

# Check if files exist in history
git log --all -- backend/.env.production.backup
git log --all -- frontend/.env.production
```

---

## 📋 STEP 5: Final Checklist

- [ ] All credentials rotated (database, email, Pusher, Paystack, JWT, Stripe)
- [ ] Git history cleaned using one of the methods above
- [ ] Force pushed cleaned history
- [ ] Verified secrets no longer in history
- [ ] Updated production servers with new credentials
- [ ] Tested application with new credentials
- [ ] Notified GitGuardian that issue is resolved
- [ ] Set up GitHub secret scanning alerts

---

## 🔐 PREVENTING FUTURE LEAKS

### 1. Use .env.example files (already created)
Never put real credentials in example files

### 2. Enable pre-commit hooks
```bash
# Install git-secrets
git secrets --install
git secrets --register-aws
```

### 3. GitHub Secret Scanning
- Go to repository Settings → Security → Code security
- Enable "Secret scanning"
- Enable "Push protection"

### 4. Use Environment Variables in Production
- Vercel: Settings → Environment Variables
- cPanel: Use actual .env files on server, NOT in git

---

## ⏰ TIMELINE

1. **NOW (0-15 min):** Rotate ALL credentials
2. **NEXT (15-30 min):** Clean git history
3. **THEN (30-45 min):** Force push and verify
4. **FINALLY (45-60 min):** Update production servers and test

---

## 📞 SUPPORT

If you need help:
- Pusher Support: https://support.pusher.com
- Paystack Support: https://support.paystack.com
- Stripe Support: https://support.stripe.com

---

**Created:** 2025-12-07
**Status:** 🚨 URGENT - Action Required
