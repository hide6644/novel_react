# Testing Patterns

**Analysis Date:** 2026-04-13

## Test Framework

**Backend Runner:**
- Spring Boot Starter Test (JUnit 5 + MockMvc)
- Test-specific configuration context

**Frontend Runner:**
- Vitest 4.1.4 (configured via Vite plugin).
- `@testing-library/react` (v16) for DOM manipulation and evaluation.
- `jsdom` (v29) DOM simulated environment for Node.

## Test File Organization

**Backend Location:**
- Standard Java test path: `/backend/src/test/java/...`
- Matches typical package structures mirror to `main/java`.

**Frontend Location:**
- Unit and smoke tests placed alongside source logic (e.g., `App.test.jsx`).

## Testing Execution

**Execution Commands:**
```bash
# Frontend
npm run test           # Vitest execution
npm run test -- --run  # CI mode execution (one-off)

# Backend
mvn test               # Execute all JUnit tests
```

## Common Patterns

**Smoke Testing (Frontend):**
- Verify fundamental React mounting limits without browser context (testing rendering pipelines).

**Service & Controller Testing (Backend):**
- Utilize `@MockBean` for isolated logic boundaries.
- Utilize `@WebMvcTest` for Controller endpoint verifications.

---

*Testing analysis: 2026-04-13*
