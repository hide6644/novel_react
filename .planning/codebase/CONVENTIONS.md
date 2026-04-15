# Code Conventions

**Analysis Date:** 2026-04-13

## Formatting

**Backend:**
- Likely standard Java/Spring conventions. Maven compiler configuration is preset.

**Frontend:**
- ESLint (v9) is utilized for code hygiene and styling policies.
- JSX structural organization uses standard functional components logic.

## Naming

**Backend:**
- Classes: PascalCase (`AuthorController`).
- Methods/Variables: camelCase.
- Endpoints: Kebab-case URL patterns (implied REST standard).

**Frontend:**
- React Components: PascalCase filenames (`NovelList.jsx`).
- Custom Hooks: `use` prefix, camelCase (`useCrud.js`).
- State variables / standard functions: camelCase.

## Code Organization

- **DTO Encapsulation (Backend):** Requests and responses strictly use suffix `Request` or `Response` (e.g., `LoginRequest`, `NovelResponse`), isolating JSON data from Database Entity properties.
- **Hook Extraction (Frontend):** Common TanStack Query logic is cleanly factored out into custom reusable hooks instead of embedding API logic within presentation files.

---

*Conventions analysis: 2026-04-13*
