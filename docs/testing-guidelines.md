# Testing Guidelines

## Overview

This document outlines the testing strategy and guidelines for the application. We follow a **Test-Driven Development (TDD)** approach, emphasizing **quality over quantity** while maintaining a minimum of **80% unit test coverage**.

---

## Testing Philosophy

### Test-Driven Development (TDD)

We follow the TDD cycle: **Red → Green → Refactor**

1. **Red**: Write a failing test first
2. **Green**: Write the minimum code to make the test pass
3. **Refactor**: Improve the code while keeping tests green

### Core Principles

- **Write tests before implementation** (when possible)
- **Test behavior, not implementation details**
- **Keep tests simple, readable, and maintainable**
- **Focus on quality over quantity** - meaningful tests that provide value
- **Tests should be fast and independent**
- **One assertion per test when possible** (but prioritize clarity)

---

## Testing Stack

### Framework
- **Jest**: JavaScript testing framework
- **React Testing Library**: For React component testing
- **@testing-library/jest-dom**: Custom Jest matchers for DOM

### Coverage Tool
- **Jest Coverage**: Built-in coverage reporting
- **Target**: Minimum 80% coverage for unit tests

---

## Test Coverage Requirements

### Coverage Thresholds

We aim for **at least 80% coverage** across the following metrics:

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Coverage Scope

**What to Test:**
- ✅ Utility functions and helpers
- ✅ Business logic and data transformations
- ✅ React components (user interactions, rendering)
- ✅ Custom hooks
- ✅ API route handlers (Next.js)
- ✅ Form validation logic
- ✅ Error handling

**What NOT to Test (for this phase):**
- ❌ Third-party library internals
- ❌ Next.js framework code
- ❌ Simple getters/setters without logic
- ❌ Configuration files
- ❌ Type definitions (TypeScript)

### Quality Over Quantity

**Good Test:**
- Tests a specific behavior or edge case
- Is readable and self-documenting
- Provides value when it fails
- Runs quickly

**Bad Test:**
- Tests implementation details
- Is overly complex or hard to understand
- Provides little value when it fails
- Duplicates other tests

---

## Test Structure and Organization

### File Naming Convention

- Test files should be co-located with source files
- Naming pattern: `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`
- Example: `utils.ts` → `utils.test.ts`

### Directory Structure

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   └── Card/
│       ├── Card.tsx
│       └── Card.test.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useAuth.test.ts
├── utils/
│   ├── formatters.ts
│   └── formatters.test.ts
└── __tests__/
    └── setup.ts
```

### Test File Structure

```typescript
// Describe the unit under test
describe('ComponentName or FunctionName', () => {
  // Setup (beforeEach, afterEach if needed)
  
  describe('when [specific condition]', () => {
    it('should [expected behavior]', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

---

## Unit Testing Guidelines

### Testing React Components

#### What to Test

1. **Rendering**: Component renders correctly with given props
2. **User Interactions**: Click, input, form submissions
3. **Conditional Rendering**: Shows/hides content based on state/props
4. **Props Changes**: Component updates when props change
5. **Accessibility**: ARIA attributes, keyboard navigation

#### Example: Component Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Testing Custom Hooks

#### What to Test

1. **Initial State**: Hook returns correct initial values
2. **State Updates**: Hook updates state correctly
3. **Side Effects**: Cleanup functions, effect dependencies
4. **Edge Cases**: Error handling, boundary conditions

#### Example: Hook Test

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Testing Utility Functions

#### What to Test

1. **Happy Path**: Normal input produces expected output
2. **Edge Cases**: Empty strings, null, undefined, boundary values
3. **Error Cases**: Invalid input handling
4. **Multiple Scenarios**: Different input combinations

#### Example: Utility Test

```typescript
import { formatDate } from './formatters';

describe('formatDate', () => {
  it('should format valid date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('Jan 15, 2024');
  });

  it('should handle invalid date', () => {
    expect(() => formatDate(new Date('invalid'))).toThrow();
  });

  it('should handle null input', () => {
    expect(formatDate(null)).toBe('');
  });
});
```

### Testing Next.js API Routes

#### What to Test

1. **Request Handling**: Correct HTTP method handling
2. **Response Format**: Status codes, response body structure
3. **Error Handling**: Proper error responses
4. **Validation**: Input validation and sanitization

#### Example: API Route Test

```typescript
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/users';

describe('/api/users', () => {
  it('should return 200 with user data for GET request', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('users');
  });

  it('should return 405 for unsupported method', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
```

---

## Jest Configuration

### Recommended Jest Config (jest.config.js)

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### Jest Setup File (jest.setup.js)

```javascript
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Global test utilities or mocks
```

---

## Best Practices

### 1. Test Naming

**Good:**
```typescript
it('should format date as MM/DD/YYYY when given valid date', () => {});
it('should return error message when email is invalid', () => {});
```

**Bad:**
```typescript
it('works', () => {});
it('test 1', () => {});
```

### 2. Arrange-Act-Assert Pattern

```typescript
it('should calculate total correctly', () => {
  // Arrange
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 },
  ];
  
  // Act
  const total = calculateTotal(items);
  
  // Assert
  expect(total).toBe(35);
});
```

### 3. Use Descriptive Test Descriptions

- Start with "should" or "when"
- Describe the behavior being tested
- Include context when relevant

### 4. Test Isolation

- Each test should be independent
- Don't rely on test execution order
- Clean up after each test (use `beforeEach`, `afterEach`)

### 5. Mock External Dependencies

```typescript
// Mock API calls
jest.mock('@/lib/api', () => ({
  fetchUser: jest.fn(),
}));

// Mock Next.js modules
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));
```

### 6. Avoid Testing Implementation Details

**Bad:**
```typescript
it('should call setState', () => {
  const component = render(<Component />);
  // Testing internal React state management
});
```

**Good:**
```typescript
it('should update displayed count when increment button is clicked', () => {
  render(<Counter />);
  fireEvent.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

### 7. Use Appropriate Matchers

```typescript
// Prefer specific matchers
expect(element).toBeInTheDocument();
expect(value).toBeGreaterThan(0);
expect(array).toHaveLength(3);
expect(object).toHaveProperty('key', 'value');
```

### 8. Handle Async Code

```typescript
it('should load data asynchronously', async () => {
  render(<DataComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

---

## Common Testing Patterns

### Testing Forms

```typescript
describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });
});
```

### Testing Error States

```typescript
it('should display error message when API call fails', async () => {
  const errorMessage = 'Failed to fetch data';
  jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error(errorMessage));
  
  render(<DataComponent />);
  
  await waitFor(() => {
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
  });
});
```

### Testing Conditional Rendering

```typescript
it('should show loading state while fetching data', () => {
  render(<DataComponent isLoading={true} />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

it('should show data when loaded', () => {
  render(<DataComponent isLoading={false} data={mockData} />);
  expect(screen.getByText(mockData.title)).toBeInTheDocument();
});
```

---

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Update snapshots
npm test -- -u
```

### Coverage Reports

After running tests with coverage, view the report:

```bash
# HTML coverage report
open coverage/lcov-report/index.html

# Terminal coverage summary
npm test -- --coverage --verbose
```

---

## Continuous Integration

### Pre-commit Hooks

Consider using Husky to run tests before commits:

```json
// package.json
{
  "scripts": {
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

### CI Pipeline

Ensure tests run in CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm run test:ci
  
- name: Check coverage
  run: |
    npm test -- --coverage
    # Fail if coverage drops below 80%
```

---

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Check `moduleNameMapper` in Jest config
   - Verify path aliases match Next.js config

2. **CSS imports failing**
   - Add CSS mock in Jest setup:
     ```javascript
     module.exports = {};
     ```

3. **Next.js Image component**
   - Mock the Image component (see Jest setup example)

4. **Async/await issues**
   - Use `waitFor` from React Testing Library
   - Ensure proper `async/await` in test functions

---

## Test Review Checklist

Before submitting code, ensure:

- [ ] All new features have corresponding tests
- [ ] Tests follow TDD principles (written before or alongside code)
- [ ] Test coverage meets 80% threshold
- [ ] Tests are readable and well-documented
- [ ] Tests are independent and can run in any order
- [ ] Edge cases and error scenarios are covered
- [ ] No implementation details are tested
- [ ] Tests run successfully locally
- [ ] No console errors or warnings in test output

---

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Version History

- **v1.0** - Initial Testing Guidelines Document
  - TDD approach and principles
  - Jest configuration for Next.js
  - Unit testing guidelines and examples
  - 80% coverage requirements
  - Best practices and common patterns

