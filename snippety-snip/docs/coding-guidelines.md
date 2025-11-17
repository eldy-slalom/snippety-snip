# Coding Guidelines

## Overview

This document outlines coding standards, style conventions, and quality principles for this project. All developers must follow these guidelines to maintain consistency, readability, and maintainability across the codebase.

---

## Table of Contents

1. [General Principles](#general-principles)
2. [TypeScript Standards](#typescript-standards)
3. [Code Style](#code-style)
4. [Naming Conventions](#naming-conventions)
5. [File Organization](#file-organization)
6. [Code Quality](#code-quality)
7. [Linting and Formatting](#linting-and-formatting)
8. [Comments and Documentation](#comments-and-documentation)
9. [Error Handling](#error-handling)
10. [Performance Considerations](#performance-considerations)
11. [Security Best Practices](#security-best-practices)

---

## General Principles

### Code Quality Philosophy

- **Readability First**: Code should be easy to read and understand
- **Consistency**: Follow established patterns and conventions
- **Simplicity**: Prefer simple solutions over complex ones
- **Maintainability**: Write code that is easy to modify and extend
- **DRY (Don't Repeat Yourself)**: Avoid code duplication
- **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until needed
- **SOLID Principles**: Apply object-oriented design principles where applicable

### Code Review Standards

- All code must be reviewed before merging
- Code should follow these guidelines
- Tests must pass and coverage requirements met
- No linter errors or warnings
- Documentation updated when necessary

---

## TypeScript Standards

### Type Safety

#### Use Explicit Types

**Good:**

```typescript
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

interface User {
  id: string;
  email: string;
  name: string;
}
```

**Bad:**

```typescript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

#### Avoid `any` Type

**Good:**

```typescript
function processData(data: unknown): ProcessedData {
  if (isValidData(data)) {
    return transformData(data);
  }
  throw new Error("Invalid data");
}
```

**Bad:**

```typescript
function processData(data: any): any {
  return transformData(data);
}
```

#### Use Type Guards

```typescript
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "email" in obj &&
    "name" in obj
  );
}
```

### Type Definitions

#### Prefer Interfaces for Objects

```typescript
interface ApiResponse {
  data: User[];
  status: number;
  message: string;
}
```

#### Use Types for Unions and Intersections

```typescript
type Status = "pending" | "approved" | "rejected";
type UserWithRole = User & { role: Role };
```

#### Use Enums for Constants

```typescript
enum UserRole {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}
```

### Type Imports

**Good:**

```typescript
import type { User } from "./types";
import { fetchUser } from "./api";
```

**Bad:**

```typescript
import { User, fetchUser } from "./types";
```

### Generics

Use generics for reusable, type-safe code:

```typescript
function createRepository<T extends { id: string }>(): Repository<T> {
  return {
    findById: (id: string): T | null => {
      // Implementation
    },
    save: (item: T): T => {
      // Implementation
    },
  };
}
```

### Utility Types

Leverage TypeScript utility types:

```typescript
// Partial
type PartialUser = Partial<User>;

// Pick
type UserPreview = Pick<User, "id" | "name">;

// Omit
type UserWithoutId = Omit<User, "id">;

// Record
type UserMap = Record<string, User>;
```

---

## Code Style

### Formatting

#### Indentation

- Use **2 spaces** for indentation (no tabs)
- Configure your editor to show whitespace

#### Line Length

- Maximum line length: **100 characters**
- Break long lines logically

**Good:**

```typescript
const result = await fetchUserData(userId, {
  includeProfile: true,
  includeSettings: false,
});
```

**Bad:**

```typescript
const result = await fetchUserData(userId, {
  includeProfile: true,
  includeSettings: false,
});
```

#### Semicolons

- **Always use semicolons** for consistency

#### Quotes

- Use **single quotes** for strings
- Use **double quotes** only when escaping single quotes

```typescript
const message = "Hello, world!";
const quote = "It's a beautiful day";
```

#### Trailing Commas

- Use trailing commas in multi-line arrays, objects, and function parameters

```typescript
const items = [
  "item1",
  "item2",
  "item3", // trailing comma
];
```

### Spacing

#### Object Literals

```typescript
// Good
const user = { id: "1", name: "John" };

// Good (multi-line)
const user = {
  id: "1",
  name: "John",
  email: "john@example.com",
};
```

#### Function Declarations

```typescript
// Good
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Good (arrow function)
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

#### Control Structures

```typescript
// Good
if (condition) {
  doSomething();
}

// Good
for (const item of items) {
  processItem(item);
}
```

### Braces

- Always use braces, even for single-line blocks

```typescript
// Good
if (condition) {
  return true;
}

// Bad
if (condition) return true;
```

---

## Naming Conventions

### Variables and Functions

- Use **camelCase** for variables and functions
- Use descriptive names that indicate purpose

**Good:**

```typescript
const userCount = 10;
const isAuthenticated = true;
function calculateTotalPrice() {}
```

**Bad:**

```typescript
const uc = 10;
const flag = true;
function calc() {}
```

### Constants

- Use **UPPER_SNAKE_CASE** for constants
- Use **camelCase** for exported constants

```typescript
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = "https://api.example.com";

export const defaultConfig = {
  timeout: 5000,
};
```

### Components

- Use **PascalCase** for React components
- Component name should match file name

```typescript
// Button.tsx
export function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### Types and Interfaces

- Use **PascalCase** for types and interfaces
- Prefix interfaces with `I` only if it adds clarity (generally avoid)

```typescript
interface User {
  id: string;
  name: string;
}

type UserStatus = "active" | "inactive";
```

### Files and Directories

- Use **kebab-case** for file and directory names
- Component files: `PascalCase.tsx` (matches component name)
- Utility files: `kebab-case.ts`

```
src/
├── components/
│   ├── Button.tsx
│   └── user-profile.tsx
├── utils/
│   ├── date-formatters.ts
│   └── api-helpers.ts
└── hooks/
    └── use-auth.ts
```

### Boolean Variables

- Prefix boolean variables with `is`, `has`, `should`, `can`, `will`

```typescript
const isVisible = true;
const hasPermission = false;
const shouldRender = true;
const canEdit = false;
```

---

## File Organization

### Next.js App Router

This project uses the **App Router** (`app/` directory), which is the modern, recommended approach for Next.js applications.

### Project Structure

```
project-root/
├── app/                          # Next.js App Router (Frontend Pages + Backend API Routes)
│   ├── api/                      # Backend API Routes (Server-side)
│   │   └── snippets/
│   │       ├── route.ts          # API endpoint: /api/snippets (GET, POST)
│   │       └── [id]/
│   │           └── route.ts      # API endpoint: /api/snippets/[id] (GET, PUT, DELETE)
│   ├── snippets/                 # Snippet pages
│   │   ├── new/
│   │   │   └── page.tsx          # Frontend page: /snippets/new (add snippet)
│   │   └── [id]/
│   │       └── page.tsx          # Frontend page: /snippets/[id] (view snippet)
│   ├── layout.tsx                # Root layout (wraps all pages)
│   ├── page.tsx                  # Frontend page: / (home - list all snippets)
│   ├── loading.tsx               # Loading UI component
│   ├── error.tsx                 # Error UI component
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── ui/                       # Basic UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Textarea.tsx
│   ├── snippets/                 # Snippet-specific components
│   │   ├── SnippetList.tsx       # List of snippets
│   │   ├── SnippetCard.tsx       # Individual snippet card
│   │   ├── SnippetForm.tsx       # Form for adding/editing snippets
│   │   └── SnippetView.tsx       # View snippet details
│   └── layout/                   # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
├── hooks/                        # Custom React hooks
│   └── use-snippets.ts           # Hook for fetching snippets
├── lib/                          # Library code, configurations
│   ├── db/                       # SQLite database utilities
│   │   ├── client.ts             # SQLite database client setup
│   │   ├── migrations/           # Database migration files
│   │   └── snippets.ts           # Snippet data access functions
│   └── api-client.ts             # API client configuration (if needed)
├── types/                        # TypeScript type definitions
│   ├── snippet.ts                # Snippet type definitions
│   └── index.ts                  # Barrel export
├── utils/                        # Utility functions (pure functions, helpers)
│   ├── formatters.ts             # Date, text formatters
│   └── validators.ts             # Form validation
├── constants/                    # Application constants
│   └── config.ts                 # App configuration
├── styles/                       # Global styles (if not using CSS-in-JS)
│   └── variables.css             # CSS variables
├── __tests__/                    # Test utilities and mocks
│   ├── setup.ts
│   └── mocks/
├── public/                       # Static assets
│   ├── images/
│   └── favicon.ico
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
├── .eslintrc.json                # ESLint configuration
├── .prettierrc                   # Prettier configuration
└── package.json
```

### Frontend Pages (App Router)

**Location**: `app/**/page.tsx`

Pages are React Server Components by default. The file structure determines the URL route:

```
app/
├── page.tsx                    → / (home page - list all snippets)
├── snippets/
│   ├── new/
│   │   └── page.tsx            → /snippets/new (add new snippet)
│   └── [id]/
│       └── page.tsx            → /snippets/[id] (view snippet)
```

**Example Page:**

```typescript
// app/page.tsx (home - list snippets)
export default async function HomePage() {
  // Server Component - can fetch data directly
  const snippets = await getSnippets();

  return (
    <div>
      <h1>My Snippets</h1>
      <SnippetList snippets={snippets} />
    </div>
  );
}

// app/snippets/[id]/page.tsx (view snippet)
export default async function SnippetPage({
  params,
}: {
  params: { id: string };
}) {
  const snippet = await getSnippetById(params.id);

  if (!snippet) {
    notFound();
  }

  return <SnippetView snippet={snippet} />;
}
```

### Backend API Routes (App Router)

**Location**: `app/api/**/route.ts`

API routes are Server-side Route Handlers. Each route file exports HTTP method handlers:

```
app/api/
└── snippets/
    ├── route.ts                → /api/snippets (handles GET, POST)
    └── [id]/
        └── route.ts            → /api/snippets/[id] (handles GET, PUT, DELETE)
```

**Example API Route:**

```typescript
// app/api/snippets/route.ts
import { NextRequest, NextResponse } from "next/server";

// GET /api/snippets - Get all snippets
export async function GET(request: NextRequest) {
  try {
    const snippets = await getSnippets();
    return NextResponse.json({ snippets }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    );
  }
}

// POST /api/snippets - Create a new snippet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const snippet = await createSnippet(body);
    return NextResponse.json({ snippet }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create snippet" },
      { status: 500 }
    );
  }
}
```

**Dynamic API Routes:**

```typescript
// app/api/snippets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

// GET /api/snippets/[id] - Get a specific snippet
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const snippet = await getSnippetById(id);

  if (!snippet) {
    return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
  }

  return NextResponse.json({ snippet });
}

// DELETE /api/snippets/[id] - Delete a snippet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await deleteSnippet(id);
  return NextResponse.json({ success: true }, { status: 200 });
}
```

### Component Organization

**UI Components** (`components/ui/`):

- Reusable, generic components
- No business logic
- Examples: Button, Input, Card, Modal

**Feature Components** (`components/snippets/`):

- Snippet-specific components
- May contain business logic
- Examples: SnippetList, SnippetCard, SnippetForm, SnippetView

**Layout Components** (`components/layout/`):

- Layout-related components
- Examples: Header, Footer, Sidebar, Navigation

### Backend Code Organization

**API Route Handlers** (`app/api/**/route.ts`):

- Handle HTTP requests
- Should be thin - delegate to service layer
- Focus on request/response handling

**Service Layer** (`lib/db/`):

- Business logic
- SQLite database operations
- Data access layer
- Should be imported by API routes

**Example Structure:**

```typescript
// app/api/snippets/route.ts (thin handler)
import { SnippetService } from "@/lib/db/snippets";

export async function GET() {
  const snippets = await SnippetService.getAllSnippets();
  return NextResponse.json({ snippets });
}

// lib/db/snippets.ts (SQLite database operations)
import { db } from "@/lib/db/client";

export class SnippetService {
  static async getAllSnippets() {
    // SQLite query
    return db.prepare("SELECT * FROM snippets ORDER BY created_at DESC").all();
  }

  static async createSnippet(data: CreateSnippetData) {
    // Validation and SQLite insert
    const stmt = db.prepare(
      "INSERT INTO snippets (title, content, language) VALUES (?, ?, ?)"
    );
    const result = stmt.run(data.title, data.content, data.language);
    return this.getSnippetById(result.lastInsertRowid.toString());
  }

  static async getSnippetById(id: string) {
    return db.prepare("SELECT * FROM snippets WHERE id = ?").get(id);
  }
}
```

### Shared Code Organization

**Utilities** (`utils/`):

- Pure functions
- No side effects
- Reusable across frontend and backend

**Types** (`types/`):

- Shared TypeScript types
- API request/response types
- Database model types

**Constants** (`constants/`):

- Application-wide constants
- Route paths, configuration values

**Hooks** (`hooks/`):

- React hooks only (frontend)
- Cannot be used in API routes

**Lib** (`lib/`):

- Library code, configurations
- SQLite database client setup (`lib/db/client.ts`)
- Database migrations (`lib/db/migrations/`)
- External service wrappers
- Can be used in both frontend and backend

### Import Order

Organize imports in the following order:

1. External dependencies (React, Next.js, third-party)
2. Internal absolute imports (@/...)
3. Relative imports
4. Type imports
5. Styles

```typescript
// External
import { useState, useEffect } from "react";
import { NextRequest, NextResponse } from "next/server"; // For API routes

// Internal absolute
import { Button } from "@/components/ui/Button";
import { useSnippets } from "@/hooks/use-snippets";
import { SnippetService } from "@/lib/db/snippets";

// Relative
import { formatDate } from "./utils";
import { SnippetCard } from "../components/snippets/SnippetCard";

// Types
import type { Snippet } from "@/types/snippet";
import type { ApiResponse } from "@/types/api";

// Styles
import styles from "./Component.module.css";
```

### Export Conventions

#### Default Exports

- Use default exports for **pages** (`app/**/page.tsx`)
- Use default exports for **components** (when appropriate)
- Use default exports for **layouts** (`app/**/layout.tsx`)

**Good:**

```typescript
// app/page.tsx (Page - home page)
export default function HomePage() {
  return <div>My Snippets</div>;
}

// app/snippets/new/page.tsx (Page - add snippet)
export default function NewSnippetPage() {
  return <SnippetForm />;
}

// components/ui/Button.tsx (Component)
export default function Button() {}

// app/layout.tsx (Layout)
export default function RootLayout({ children }) {
  return <html>{children}</html>;
}
```

#### Named Exports

- Use named exports for **API route handlers** (`app/api/**/route.ts`)
- Use named exports for **utilities** and **types**
- Use named exports for **services** and **library code**

**Good:**

```typescript
// app/api/snippets/route.ts (API Route)
export async function GET() {}
export async function POST() {}

// utils/formatters.ts (Utilities)
export function formatDate() {}
export function formatCode() {}

// lib/db/snippets.ts (Service)
export class SnippetService {
  static async getAllSnippets() {}
  static async createSnippet() {}
}
```

#### Barrel Exports

Use index files for cleaner imports:

```typescript
// components/ui/index.ts
export { Button } from "./Button";
export { Card } from "./Card";
export { Input } from "./Input";
```

---

## Code Quality

### Functions

#### Keep Functions Small

- Functions should do one thing
- Aim for functions under 20 lines
- Extract complex logic into separate functions

#### Function Parameters

- Limit parameters to 3-4 maximum
- Use objects for multiple parameters

**Good:**

```typescript
function createUser(options: CreateUserOptions) {
  const { name, email, role } = options;
  // Implementation
}
```

**Bad:**

```typescript
function createUser(
  name: string,
  email: string,
  role: string,
  age: number,
  address: string
) {
  // Too many parameters
}
```

#### Early Returns

Use early returns to reduce nesting:

**Good:**

```typescript
function processUser(user: User | null): ProcessedUser | null {
  if (!user) {
    return null;
  }

  if (!user.isActive) {
    return null;
  }

  return transformUser(user);
}
```

**Bad:**

```typescript
function processUser(user: User | null): ProcessedUser | null {
  if (user) {
    if (user.isActive) {
      return transformUser(user);
    }
  }
  return null;
}
```

### Variables

#### Use `const` by Default

- Use `const` for variables that don't change
- Use `let` only when reassignment is needed
- Avoid `var` entirely

```typescript
const userName = "John";
let counter = 0;
counter += 1;
```

#### Destructuring

Use destructuring for cleaner code:

```typescript
// Object destructuring
const { id, name, email } = user;

// Array destructuring
const [first, second] = items;

// Function parameters
function processUser({ id, name }: User) {
  // Implementation
}
```

### Conditionals

#### Prefer Ternary for Simple Conditions

```typescript
const message = isError ? "Error occurred" : "Success";
```

#### Use Logical Operators

```typescript
const displayName = user.name || "Anonymous";
const items = data?.items ?? [];
```

#### Avoid Deep Nesting

```typescript
// Good
if (!user) return null;
if (!user.isActive) return null;
if (!user.permissions) return null;

return renderUser(user);

// Bad
if (user) {
  if (user.isActive) {
    if (user.permissions) {
      return renderUser(user);
    }
  }
}
```

### Loops

#### Prefer `for...of` for Arrays

```typescript
for (const item of items) {
  processItem(item);
}
```

#### Use Array Methods

```typescript
// Map
const names = users.map((user) => user.name);

// Filter
const activeUsers = users.filter((user) => user.isActive);

// Reduce
const total = items.reduce((sum, item) => sum + item.price, 0);
```

### Async/Await

#### Prefer Async/Await over Promises

**Good:**

```typescript
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}
```

**Bad:**

```typescript
function fetchUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return response.json();
  });
}
```

#### Error Handling

```typescript
async function loadData() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error("Failed to load data:", error);
    throw error;
  }
}
```

---

## Linting and Formatting

### ESLint Configuration

#### Required Rules

- Use TypeScript ESLint plugin
- Enable React and Next.js specific rules
- Enforce consistent code style

#### Recommended ESLint Config

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### Prettier Configuration

#### Recommended Prettier Config

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### Pre-commit Hooks

Use Husky and lint-staged to enforce standards:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

### IDE Configuration

#### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Comments and Documentation

### When to Comment

- **Complex logic**: Explain why, not what
- **Business rules**: Document domain-specific logic
- **Workarounds**: Explain temporary solutions
- **Public APIs**: Document exported functions and types

### Comment Style

#### Use JSDoc for Functions

```typescript
/**
 * Calculates the total price including tax
 * @param items - Array of cart items
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @returns Total price with tax applied
 */
function calculateTotalWithTax(items: CartItem[], taxRate: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + taxRate);
}
```

#### Inline Comments

```typescript
// Good: Explains why
// Using setTimeout to debounce rapid updates
setTimeout(() => updateValue(newValue), 300);

// Bad: States the obvious
// Increment counter by 1
counter += 1;
```

### Self-Documenting Code

Prefer clear code over comments:

**Good:**

```typescript
const isUserEligibleForDiscount = user.age >= 65 && user.membershipYears >= 5;
```

**Bad:**

```typescript
// Check if user is eligible for discount (65+ years old and 5+ years membership)
if (user.age >= 65 && user.membershipYears >= 5) {
  // ...
}
```

---

## Error Handling

### Error Types

Create custom error classes:

```typescript
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}
```

### Error Handling Patterns

#### Try-Catch Blocks

```typescript
async function fetchUserData(userId: string) {
  try {
    const user = await api.getUser(userId);
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      throw new NotFoundError(`User ${userId} not found`);
    }
    throw error;
  }
}
```

#### Error Boundaries (React)

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Never Swallow Errors

**Bad:**

```typescript
try {
  riskyOperation();
} catch (error) {
  // Silent failure - BAD!
}
```

**Good:**

```typescript
try {
  riskyOperation();
} catch (error) {
  console.error("Operation failed:", error);
  // Handle or rethrow
  throw error;
}
```

---

## Performance Considerations

### React Performance

#### Memoization

```typescript
// Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Memoize components
const MemoizedComponent = React.memo(Component);
```

#### Avoid Unnecessary Re-renders

```typescript
// Good: Extract component
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  );
}

// Bad: Inline component causes re-renders
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Code Splitting

```typescript
// Dynamic imports
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Loading />,
});
```

### Avoid Premature Optimization

- Write clear, maintainable code first
- Profile before optimizing
- Optimize bottlenecks, not everything

---

## Security Best Practices

### Input Validation

```typescript
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}
```

### Avoid Dangerous Patterns

#### Never Use `eval()`

```typescript
// NEVER DO THIS
eval(userInput);
```

#### Sanitize User Input

```typescript
// Good: Use parameterized queries
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId]);

// Bad: String concatenation (SQL injection risk)
const query = `SELECT * FROM users WHERE id = ${userId}`;
```

### Environment Variables

```typescript
// Good: Validate environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable is required");
}

// Bad: Assume environment variables exist
const apiKey = process.env.API_KEY!;
```

### XSS Prevention

```typescript
// Good: React automatically escapes
<div>{userInput}</div>

// Bad: dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

---

## Code Review Checklist

Before submitting code for review:

- [ ] Code follows style guidelines
- [ ] TypeScript types are properly defined
- [ ] No linter errors or warnings
- [ ] Code is formatted with Prettier
- [ ] Tests are written and passing
- [ ] Error handling is implemented
- [ ] No console.log statements (except errors)
- [ ] Comments explain complex logic
- [ ] No hardcoded values (use constants)
- [ ] Performance considerations addressed
- [ ] Security best practices followed

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Next.js Documentation](https://nextjs.org/docs)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

---

## Version History

- **v1.0** - Initial Coding Guidelines Document
  - TypeScript best practices
  - Code style and naming conventions
  - File organization standards
  - Linting and formatting configuration
  - Error handling patterns
  - Performance and security considerations
