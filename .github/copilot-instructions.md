# GitHub Copilot Instructions

> **Note**: This file is located at `.github/copilot-instructions.md` and is used by GitHub Copilot to understand project context.

This file contains high-level instructions for GitHub Copilot to follow when generating code for this project. For detailed guidance, refer to the documentation files in the `docs/` directory.

## Active Technologies

- **TypeScript** - Project uses Next.js + TypeScript (see `tsconfig.json`)
- **Next.js (App Router)** - React framework with app directory structure
- **React** - UI library
- **SQLite** - Database using better-sqlite3 or sqlite client (see `lib/db/client.ts`)
- **Jest + React Testing Library** - Testing framework and utilities

## Project Structure

```text
package/                    # Main application directory
├── app/                   # Next.js App Router pages and API routes
├── components/            # Reusable React components
├── lib/                   # Database and utility libraries
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── public/               # Static assets
```

## Commands

```bash
npm test && npm run lint
```

## Code Style

- **TypeScript**: Follow standard conventions and project `tsconfig.json` settings
- **Next.js App Router**: Use server components by default, client components when needed
- **Testing**: Write tests using Jest and React Testing Library

## Documentation Overview

The project documentation is built during the bootcamp sessions:

- [Project Overview](../docs/project-overview.md) - Overview of the snippety-snip project
- [Coding Guidelines](../docs/coding-guidelines.md) - Coding style, quality principles, and best practices
- [Functional Requirements](../docs/functional-requirements.md) - Core functional requirements for the snippet app
- [UI Guidelines](../docs/ui-guidelines.md) - Design system and UI guidelines for the snippet app
- [Testing Guidelines](../docs/testing-guidelines.md) - Testing strategy and best practices

## Recent Changes

- **002-snippet-creation**: Added TypeScript + Next.js (App Router), React, better-sqlite3 SQLite client, Jest + React Testing Library for tests

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
