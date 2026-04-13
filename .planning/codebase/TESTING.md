# Testing

## 1. Backend Testing
- **Framework**: JUnit 5, part of `spring-boot-starter-test`.
- **Location**: Tests are located in `backend/src/test/java/`.
- **Capabilities**:
  - Integration testing with `@SpringBootTest`.
  - Slice testing with `@WebMvcTest` and `@DataJpaTest`.
  - Security testing via `spring-security-test`.
  - Typical use of Mockito (bundled with spring-boot-starter-test) for mocking service layers.

## 2. Frontend Testing
- **Framework & Config**: Currently, no dedicated test framework (e.g., Vitest, Jest, Cypress) is explicitly configured or present in front-end dependencies (`package.json`).
- **Coverage**: No explicit frontend test coverage tasks automated in npm scripts.
- **Mocking**: Not configured. 

## 3. Recommendations
- Implement Vitest and React Testing Library for the frontend.
- Utilize Playwright or Cypress for end-to-end user-flow validation across the frontend and backend.
