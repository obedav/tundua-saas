# Testing Guide - Tundua SaaS

Complete guide to testing your application with Vitest and React Testing Library.

---

## 🚀 Quick Start

### Run Tests

```bash
# Run all tests in watch mode (development)
npm test

# Run tests once (CI/production)
npm run test:run

# Run tests with UI (interactive)
npm run test:ui

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

After running `npm run test:coverage`, open `coverage/index.html` in your browser to see detailed coverage report.

**Current Coverage Thresholds:**
- Lines: 60%
- Functions: 60%
- Branches: 60%
- Statements: 60%

---

## 📁 Test Structure

```
src/
├── lib/
│   ├── env.ts
│   └── env.test.ts          # Unit tests for env validation
├── components/
│   ├── ErrorBoundary.tsx
│   └── ErrorBoundary.test.tsx # Component tests
└── tests/
    ├── setup.ts             # Test environment setup
    ├── test-utils.tsx       # Reusable test helpers
    └── test-utils.test.tsx  # Tests for test utilities
```

---

## 🧪 Writing Tests

### Unit Tests (Functions/Logic)

```typescript
// src/lib/myFunction.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from './myFunction';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });

  it('should handle edge cases', () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

### Component Tests

```typescript
// src/components/MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### Tests with Providers (API, Auth, etc.)

```typescript
import { renderWithProviders } from '@/tests/test-utils';

describe('MyComponent with providers', () => {
  it('should work with QueryClient', () => {
    renderWithProviders(<MyComponent />);
    // Component now has access to React Query
  });
});
```

---

## 🛠️ Test Utilities

We provide helpful utilities in `src/tests/test-utils.tsx`:

### Mock Creators

```typescript
import {
  createMockUser,
  createMockApplication,
  createMockNotification,
  createMockApiResponse,
  createMockApiError,
} from '@/tests/test-utils';

// Create mock data with defaults
const user = createMockUser();

// Override specific properties
const admin = createMockUser({
  role: 'admin',
  email: 'admin@example.com',
});

// Create API responses
const successResponse = createMockApiResponse({ id: 1, name: 'Test' });
const errorResponse = createMockApiError('Something went wrong', 500);
```

### Custom Render

```typescript
import { renderWithProviders } from '@/tests/test-utils';

// Wraps component with QueryClient and other providers
const { getByText, queryClient } = renderWithProviders(<MyComponent />);
```

---

## 🎯 Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad:**
```typescript
it('should set state to true', () => {
  // Testing implementation details
  expect(component.state.isOpen).toBe(true);
});
```

✅ **Good:**
```typescript
it('should show modal when button is clicked', async () => {
  // Testing user-visible behavior
  const user = userEvent.setup();
  render(<MyComponent />);

  await user.click(screen.getByRole('button', { name: 'Open Modal' }));

  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

### 2. Use Accessible Queries

Priority order (from most to least preferred):
1. `getByRole` - Best for accessibility
2. `getByLabelText` - For form fields
3. `getByPlaceholderText` - For inputs
4. `getByText` - For non-interactive elements
5. `getByTestId` - Last resort

```typescript
// ✅ Preferred
screen.getByRole('button', { name: 'Submit' });
screen.getByLabelText('Email');

// ❌ Avoid
screen.getByTestId('submit-button'); // Only as last resort
```

### 3. Async Testing

```typescript
import { waitFor } from '@testing-library/react';

it('should load data', async () => {
  render(<DataComponent />);

  // Wait for element to appear
  const data = await screen.findByText('Loaded Data');
  expect(data).toBeInTheDocument();

  // Or use waitFor for complex conditions
  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
  });
});
```

### 4. Clean Up Side Effects

```typescript
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup(); // Automatically done in setup.ts
  vi.clearAllMocks();
});
```

### 5. Mock External Dependencies

```typescript
import { vi } from 'vitest';

// Mock API client
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    getApplications: vi.fn().mockResolvedValue({
      data: { success: true, data: { applications: [] } }
    }),
  },
}));

// Mock Next.js router (already done in setup.ts)
// Mock window APIs (also in setup.ts)
```

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module '@/...'

**Solution:** Check `vitest.config.ts` has correct path alias:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

### Issue: "ReferenceError: fetch is not defined"

**Solution:** Vitest uses jsdom which includes fetch. If still having issues:
```typescript
import { vi } from 'vitest';

global.fetch = vi.fn();
```

### Issue: "Cannot read property 'xxx' of undefined"

**Solution:** Ensure mocks are set up in `setup.ts` or individual test files.

### Issue: "IntersectionObserver is not defined"

**Solution:** Already mocked in `setup.ts`. If still having issues, check the mock implementation.

---

## 📊 Coverage Goals

### Current Status
- Lines: ~60% (Initial Phase 2 baseline)
- Functions: ~60%
- Branches: ~60%

### Target (Phase 3)
- Lines: 80%+
- Functions: 80%+
- Branches: 75%+

### What to Test

**High Priority (Must Test):**
1. ✅ Authentication logic
2. ✅ Payment processing
3. ✅ Form validation
4. ✅ API error handling
5. ✅ User permissions/roles

**Medium Priority (Should Test):**
1. ✅ UI components
2. ✅ Navigation logic
3. ✅ Data transformations
4. ✅ Utility functions

**Low Priority (Nice to Test):**
1. Static content components
2. Simple presentational components
3. Third-party integrations (mock them)

---

## 🔧 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - run: npm ci
      - run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 🎓 Learning Path

### Beginner
1. Write unit tests for pure functions
2. Test simple components without state
3. Learn query priorities (getByRole, etc.)

### Intermediate
1. Test components with user interaction
2. Test async behavior
3. Mock API calls
4. Test error states

### Advanced
1. Test complex user flows
2. Integration tests
3. Test custom hooks
4. Performance testing

---

Last Updated: 2025-01-10
Phase 2 Status: Testing infrastructure complete ✅
