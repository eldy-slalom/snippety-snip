# Snippety-Snip Constitution

## Core Principles

### I. Test-Driven Development (NON-NEGOTIABLE)
**TDD is mandatory for all development work.** Follow the Red-Green-Refactor cycle strictly:
1. Write tests before implementation (when possible)
2. Tests must be approved before implementation begins
3. Tests must fail initially (Red)
4. Write minimum code to make tests pass (Green)
5. Refactor while keeping tests green

**Testing Requirements:**
- Minimum 80% test coverage (statements, branches, functions, lines)
- Test behavior, not implementation details
- Tests must be fast, independent, and maintainable
- Focus on quality over quantity - meaningful tests that provide value
- Use Jest for unit tests, React Testing Library for components

### II. Code Quality First
**Readability, maintainability, and simplicity are paramount.**

**Code Quality Standards:**
- **Readability First**: Code should be easy to read and understand
- **Consistency**: Follow established patterns and conventions
- **Simplicity**: Prefer simple solutions over complex ones
- **Maintainability**: Write code that is easy to modify and extend
- **DRY (Don't Repeat Yourself)**: Avoid code duplication
- **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until needed
- **SOLID Principles**: Apply object-oriented design principles where applicable

**TypeScript Standards:**
- TypeScript strict mode required
- Use explicit types, avoid `any`
- Prefer interfaces for objects, types for unions/intersections
- Use type guards for runtime type checking
- Leverage TypeScript utility types (Partial, Pick, Omit, Record)

### III. Local-First Architecture
**Privacy, speed, and offline capability are core values.**

**Architecture Principles:**
- All data stored locally in SQLite database
- No external dependencies for data storage
- No user authentication required
- Works entirely offline
- Fast, responsive interactions (< 2s page loads, < 500ms operations)

**Technology Stack:**
- Next.js 14+ (App Router) with React Server Components
- TypeScript for type safety
- SQLite for local data storage
- Server Components for better performance
- API Routes for backend functionality

### IV. User Experience Excellence
**Simplicity, clarity, and accessibility guide all design decisions.**

**UX Principles:**
- **Simplicity**: Focus on core features without bloat
- **Speed**: Fast, responsive interactions
- **Clarity**: Clear, intuitive interface
- **Feedback**: Immediate user feedback for all actions
- **Error Handling**: Helpful, actionable error messages

**Design Standards:**
- Material Design principles with terminal/green screen aesthetic
- Responsive design: mobile-first approach
- WCAG AA accessibility compliance
- Dark/light theme support
- Consistent UI patterns across the application

### V. Code Organization & Structure
**Clear file organization and consistent patterns enable maintainability.**

**File Organization:**
- Next.js App Router structure (`app/` directory)
- Pages: `app/**/page.tsx` (default exports)
- API Routes: `app/api/**/route.ts` (named exports)
- Components: `components/` (organized by feature/type)
- Utilities: `utils/` (pure functions)
- Types: `types/` (shared TypeScript types)
- Database: `lib/db/` (SQLite operations)

**Naming Conventions:**
- Components: PascalCase (`Button.tsx`)
- Files/Directories: kebab-case (`user-profile.ts`)
- Variables/Functions: camelCase (`getUserData`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- Types/Interfaces: PascalCase (`User`, `ApiResponse`)

## Development Standards

### Code Style
- **Indentation**: 2 spaces (no tabs)
- **Line Length**: Maximum 100 characters
- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings
- **Trailing Commas**: Use in multi-line arrays, objects, functions
- **Braces**: Always use braces, even for single-line blocks

### Linting & Formatting
- ESLint with TypeScript, React, and Next.js rules
- Prettier for code formatting
- Pre-commit hooks to enforce standards
- Zero linter errors or warnings allowed
- Format on save enabled

### Error Handling
- Never swallow errors silently
- Use custom error classes (ValidationError, ApiError)
- Provide meaningful error messages
- Handle errors at appropriate levels
- Log errors appropriately (console.error for development)

### Performance
- Avoid premature optimization
- Use React.memo, useMemo, useCallback appropriately
- Code splitting for large components
- Optimize database queries
- Profile before optimizing

### Security
- Input validation required for all user inputs
- Sanitize user input appropriately
- Use parameterized queries (never string concatenation)
- Validate environment variables
- Never use `eval()` or dangerous patterns
- React automatically escapes XSS (avoid dangerouslySetInnerHTML without sanitization)

## Quality Gates

### Code Review Requirements
- All code must be reviewed before merging
- Code must follow coding guidelines
- Tests must pass and coverage requirements met
- No linter errors or warnings
- Documentation updated when necessary
- TypeScript errors must be resolved

### Testing Requirements
- Minimum 80% test coverage (statements, branches, functions, lines)
- All new features must have corresponding tests
- Tests must be written before or alongside implementation (TDD)
- Tests must be independent and can run in any order
- Edge cases and error scenarios must be covered

### Quality Metrics
- Zero critical bugs
- All tests passing
- Linter errors resolved
- TypeScript errors resolved
- Code coverage met (80% minimum)
- Performance targets met (< 2s page loads, < 500ms operations)

## Architecture Constraints

### Frontend Architecture
- Use Next.js App Router (not Pages Router)
- Prefer Server Components over Client Components
- Use Client Components only when necessary (interactivity, hooks, browser APIs)
- API routes handle all backend operations
- Components organized by feature/type

### Backend Architecture
- API routes (`app/api/**/route.ts`) handle HTTP requests
- Service layer (`lib/db/`) contains business logic
- Database operations in service layer, not API routes
- Thin API handlers that delegate to service layer

### Data Layer
- SQLite database for local storage
- Database client setup in `lib/db/client.ts`
- Migrations in `lib/db/migrations/`
- Service classes for data access (`lib/db/snippets.ts`)

## Documentation Requirements

### Code Documentation
- JSDoc comments for exported functions
- Inline comments for complex logic (explain why, not what)
- Self-documenting code preferred over comments
- Document business rules and domain-specific logic

### Project Documentation
- README.md with setup and usage instructions
- API route documentation
- Component documentation (usage and props)
- Database schema documentation
- Keep documentation up-to-date with code changes

## Governance

### Constitution Authority
This constitution supersedes all other practices and guidelines. All development work must comply with these principles.

### Amendment Process
- Amendments require documentation of rationale
- Amendments require approval
- Migration plan required for breaking changes
- Version history must be maintained

### Compliance Verification
- All PRs/reviews must verify compliance with constitution
- Code reviews check adherence to principles
- Automated checks enforce technical standards (linting, tests, coverage)
- Complexity must be justified - prefer simple solutions

### Development Guidance
- Refer to detailed guidelines in `/docs/` folder for specific implementation details:
  - `/docs/coding-guidelines.md` - Detailed coding standards
  - `/docs/testing-guidelines.md` - Testing practices and examples
  - `/docs/ui-guidelines.md` - UI/UX design specifications
  - `/docs/functional-requirements.md` - Feature requirements
  - `/docs/project-overview.md` - Project vision and architecture

**Version**: 1.0.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27
