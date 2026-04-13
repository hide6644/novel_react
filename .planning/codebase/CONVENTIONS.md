# Conventions

## 1. Code Style

### Backend (Java)
- **Formatting**: Standard Java conventions. `backend/src/main/java/` follows standard package structures.
- **Boilerplate**: Uses Lombok (`@Data`, `@Getter`, `@Setter`, `@RequiredArgsConstructor`, etc.) to minimize boilerplate getter/setter/constructor code.
- **REST APIs**: Standard Spring MVC annotations (`@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping`).
- **Validation**: Uses JPA validation annotations in Entities/DTOs (from `spring-boot-starter-validation`).

### Frontend (React/JS)
- **Lints**: Uses ESLint (`eslint.config.js`) configured for React. Rules aggressively handle React Hooks rules and React Refresh.
- **Components**: Functional components utilizing React Hooks. 
- **Imports**: Relies on ES Modules.
- **Forms**: Centralized form validation using `zod` and `react-hook-form`.
- **Query Management**: `react-query` used for fetching, ensuring predictable state patterns rather than ad-hoc `useEffect` chains.

## 2. Error Handling
- **Backend**: Uses a global `@ControllerAdvice` in the `exception/` package for mapping exceptions to standard HTTP error responses.
- **Frontend**: API errors handled mostly transparently via React Query defaults, possibly surface-level bounds handling (boundary components not yet explicitly fully scoped).

## 3. Naming Conventions
- Backend: Standard `Entity`, `DTO`, `Controller`, `Service`, `Repository` class suffixes.
- Frontend: `PascalCase` for JSX extension components. `camelCase` for utilities.
