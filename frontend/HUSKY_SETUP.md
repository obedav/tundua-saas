# Husky Pre-Commit Hooks Setup

This guide will help you set up Husky to automatically run checks before every commit.

---

## 🎯 What Husky Does

Husky prevents bad code from being committed by running checks **automatically** before each commit:

1. ✅ **Type checking** - Catches TypeScript errors
2. ✅ **Linting** - Fixes code style issues
3. ✅ **Testing** - Runs tests for changed files
4. ✅ **Formatting** - Auto-formats code

**Result:** Only clean, tested code reaches your repository!

---

## 📦 Installation Steps

### Step 1: Install Dependencies

If you haven't already:

```bash
npm install --save-dev husky lint-staged prettier
```

### Step 2: Initialize Husky

Run this command to set up Husky:

```bash
npm run prepare
```

This creates a `.husky` folder with Git hooks.

### Step 3: Create Pre-Commit Hook

**On Windows (PowerShell):**
```powershell
npx husky add .husky/pre-commit "npx lint-staged"
```

**On Mac/Linux:**
```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

### Step 4: Make Hook Executable (Mac/Linux only)

```bash
chmod +x .husky/pre-commit
```

### Step 5: Test It!

```bash
# Make a change to any file
# Try to commit
git add .
git commit -m "test: testing pre-commit hooks"

# You should see:
# ✓ Type checking...
# ✓ Linting and fixing...
# ✓ Running tests...
# ✓ Formatting...
```

---

## 🛠️ What Runs on Commit?

Based on `.lintstagedrc.js`, these checks run on staged files:

### For `.ts` and `.tsx` files:
1. `tsc --noEmit` - Type checking
2. `eslint --fix` - Lint and auto-fix
3. `vitest related --run` - Run related tests

### For `.js` and `.jsx` files:
1. `eslint --fix` - Lint and auto-fix

### For `.json`, `.css`, `.md` files:
1. `prettier --write` - Format code

---

## 🚫 Skipping Hooks (Emergency Only)

Sometimes you need to commit without running hooks (NOT recommended):

```bash
git commit -m "emergency fix" --no-verify
```

⚠️ **Warning:** Only use this in emergencies! Your CI should still catch issues.

---

## 🔧 Troubleshooting

### "husky - command not found"

**Solution:** Ensure Husky is installed and run `npm run prepare`

### "Permission denied"

**Solution (Mac/Linux):**
```bash
chmod +x .husky/pre-commit
```

### Hooks not running

**Solutions:**
1. Check `.husky/pre-commit` exists
2. Verify it has execute permissions
3. Run `git config core.hooksPath` - should show `.husky`
4. Reinstall: `rm -rf .husky && npm run prepare`

### "lint-staged not found"

**Solution:**
```bash
npm install --save-dev lint-staged
```

### Tests taking too long

**Solution:** Modify `.lintstagedrc.js`:
```javascript
'*.{ts,tsx}': [
  () => 'tsc --noEmit',
  'eslint --fix',
  // Remove this line if tests are too slow:
  // 'vitest related --run',
],
```

---

## 📋 Pre-Commit Checklist

When you commit, Husky will:

- [ ] ✅ Type check your TypeScript
- [ ] ✅ Lint and fix code style
- [ ] ✅ Run tests for changed files
- [ ] ✅ Format code with Prettier

If any check fails, **the commit is blocked** until you fix the issues.

---

## 🎨 Customizing Hooks

### Add More Checks

Edit `.lintstagedrc.js`:

```javascript
module.exports = {
  '*.{ts,tsx}': [
    () => 'tsc --noEmit',
    'eslint --fix',
    'vitest related --run',
    // Add custom commands:
    'your-custom-command',
  ],
};
```

### Add More Hook Types

```bash
# Pre-push hook (runs before git push)
npx husky add .husky/pre-push "npm test"

# Commit message hook (validates commit messages)
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

---

## ✅ Verification

To verify everything is working:

1. **Make a change** to any `.ts` file
2. **Add a type error** intentionally
3. **Try to commit:**
   ```bash
   git add .
   git commit -m "test"
   ```
4. **You should see:** Error messages and commit should fail
5. **Fix the error** and commit should succeed

---

## 🚀 Benefits

### Before Husky:
- ❌ Bad code commits slip through
- ❌ CI fails after push
- ❌ Wasted time fixing later
- ❌ Inconsistent code style

### After Husky:
- ✅ Only clean code commits
- ✅ CI passes automatically
- ✅ Catches issues immediately
- ✅ Consistent code quality

---

## 📚 Related Files

- `.husky/` - Git hooks directory
- `.lintstagedrc.js` - What runs on commit
- `.prettierrc` - Code formatting rules
- `package.json` - "prepare" script

---

**Next Steps:**
1. Run `npm run prepare`
2. Create pre-commit hook
3. Test with a dummy commit
4. Celebrate! 🎉

---

Need help? Check the [Husky documentation](https://typicode.github.io/husky/)
