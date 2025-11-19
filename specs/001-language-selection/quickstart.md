# Quickstart: Assign Snippet Language Dropdown

1. **Sync branch**

   ```powershell
   git checkout 001-language-selection
   git pull
   ```

2. **Run database init (if first time)**

   ```powershell
   cd package
   npm install
   npm run db:setup
   ```

3. **Start development server**

   ```powershell
   cd package
   npm run dev
   ```

4. **Manual test flow**

   - Navigate to `http://localhost:3000/snippets/new`.
   - Verify the language dropdown shows all supported languages alphabetically with no default.
   - Attempt to submit without selecting a language and confirm validation blocks the request.
   - Select a language, complete other required fields, submit, and confirm the language appears in confirmation or list views.

5. **Run automated checks**
   ```powershell
   cd package
   npm test
   npm run lint
   ```
