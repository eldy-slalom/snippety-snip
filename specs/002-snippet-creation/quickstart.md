```markdown
# Quickstart: Snippet Creation Feature

## Run the app locally

1. Install dependencies

```bash
npm install
```

2. Initialize the SQLite database (runs migrations)

```bash
node lib/db/init.js
```

3. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` and navigate to `/snippets/new` to use the snippet creation form.

## Tests (TDD)

Run unit and component tests with Jest:

```bash
npm test

# Run tests with coverage
npm test -- --coverage
```

## API

Use the `/api/snippets` endpoint to create snippets programmatically. See `specs/002-snippet-creation/contracts/create-snippet.yaml` for the OpenAPI contract.

``` 
