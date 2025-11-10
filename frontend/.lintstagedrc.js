/**
 * Lint-Staged Configuration
 *
 * Runs linters and formatters on files that are staged for commit
 * This ensures only clean, properly formatted code gets committed
 *
 * WHY: Catches issues BEFORE they reach your codebase
 */

module.exports = {
  // TypeScript and TSX files
  '*.{ts,tsx}': [
    // 1. Type check
    () => 'tsc --noEmit',
    // 2. Lint and auto-fix
    'eslint --fix',
    // 3. Run tests related to changed files
    'vitest related --run',
  ],

  // JavaScript and JSX files (if any)
  '*.{js,jsx}': [
    'eslint --fix',
  ],

  // JSON, CSS, MD files - just prettier formatting
  '*.{json,css,scss,md}': [
    'prettier --write',
  ],
};
