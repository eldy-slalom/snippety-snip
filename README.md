# Snippety Snip

A local code snippet management application built with Next.js and SQLite.

## Prerequisites

- **Node.js**: 18+ (LTS recommended)
- **npm**: Comes with Node.js
- **Git**: For version control

## Local Development Setup

### 1. Verify Prerequisites

Check that you have the required versions installed:

```bash
node --version  # Should be 18 or higher
npm --version   # Should be installed
```

### 2. Install Dependencies

Navigate to the package directory and install dependencies:

```bash
cd package
npm install
```

This will install all required dependencies including Next.js, React, TypeScript, and SQLite.

### 3. Initialize Database

Initialize the SQLite database by running:

```bash
npm run db:init
```

This will:

- Create the database file at `package/data/snippets.db`
- Run database migrations to create the necessary tables
- Set up indexes and triggers

### 4. Start Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 5. Verify Setup

- Open [http://localhost:3000](http://localhost:3000) in your browser
- Check the console for any errors
- Verify the database file exists at `package/data/snippets.db`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:init` - Initialize SQLite database

## Project Structure

```
package/
├── app/              # Next.js app directory (pages, layouts)
├── lib/              # Library code
│   └── db/          # Database utilities
│       ├── client.ts        # SQLite client
│       ├── init.ts          # Database initialization
│       ├── snippets.ts      # Snippet service layer
│       └── migrations/      # Database migrations
├── data/             # Database files (gitignored)
└── public/           # Static assets
```

## Database

The application uses SQLite for local data storage. The database file is located at `package/data/snippets.db` and is automatically created when you run `npm run db:init`.

## Documentation

See the `docs/` directory for detailed documentation:

- `project-overview.md` - Project overview and architecture
- `functional-requirements.md` - Functional requirements
- `coding-guidelines.md` - Coding standards and guidelines
- `testing-guidelines.md` - Testing requirements
- `ui-guidelines.md` - UI/UX guidelines
