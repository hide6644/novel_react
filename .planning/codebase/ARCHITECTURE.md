# Architecture

**Analysis Date:** 2026-04-13

## Pattern Overview

**Overall:** Decoupled Client-Server (SPA Backend API)

**Key Characteristics:**
- Stateless RESTful API backend using Spring Boot.
- Single Page Application (SPA) frontend using React and Vite.
- Role-based Authentication via Spring Security.
- Relational data persistence via Spring Data JPA and MariaDB.

## Layers

### Backend (Spring Boot)

**Controller Layer (`com.example.novel.controller`):**
- Purpose: HTTP request routing and REST response formatting.
- Contains: `AuthorController`, `NovelController`, `UserController`
- Depends on: Service layer
- Used by: React Frontend HTTP client (Axios)

**Service Layer (`com.example.novel.service`):**
- Purpose: Core business logic and transaction management.
- Contains: `AuthorService`, `NovelService`, `UserService`
- Depends on: Repository layer, Entity layer
- Used by: Controller layer

**Repository Layer (`com.example.novel.repository`):**
- Purpose: Database abstraction and data access.
- Contains: `AuthorRepository`, `NovelRepository`, `UserRepository`
- Depends on: Spring Data JPA (MariaDB)
- Used by: Service layer

**Cross-Cutting / Core (`com.example.novel.*`):**
- DTO (`dto`): Data Transfer Objects for API request/response isolation.
- Security (`security`): User authentication and JWT/Session strategies.
- Config (`config`): Spring container configurations (`SecurityConfig`, `JpaAuditConfig`).

### Frontend (React)

**View / UI Layer (`src/pages`, `src/components`):**
- Purpose: Rendering user interface and capturing user intent.
- Contains: Routable pages (`NovelList`, `Login`), Reusable Components (`Navbar`).
- Depends on: Hooks layer, Context layer.

**State / Data Fetching (`src/hooks`, `src/api`):**
- Purpose: API integration and local/remote state management.
- Contains: Custom hooks (e.g., `useCrud.js`), Axios setup.
- Pattern: React Query handles caching and asynchronous server state.

**Global Context (`src/context`):**
- Purpose: Application-wide state sharing logic.
- Contains: `AuthContext.jsx` for user session visibility.

## Data Flow

**HTTP API Request Flow:**
1. User clicks action in React component.
2. React component invokes `useCrud` hook (TanStack Query).
3. `api/axios.js` issues HTTP request to Spring Boot.
4. `Spring Security` authenticates request via filters.
5. `@RestController` validates DTO payloads.
6. `@Service` executes transactional business rules.
7. `Repository` interacts with MariaDB to persist/fetch entities.
8. `dto` / `mapper` maps entities to presentation format.
9. JSON response is returned, cached by React Query, and UI updates.

## Key Abstractions

**Service Interface Pattern (Backend):**
- Purpose: Isolate business logic.
- Pattern: Dependency Injection (`@Service`).

**useCrud Hook (Frontend):**
- Purpose: Centralized reusable CRUD operations against backend API.
- Pattern: React Custom Hook encapsulating TanStack Query primitives.

## Entry Points

**Backend Entry:**
- Location: `NovelApplication.java` (Spring Boot main method)
- Triggers: Java execution
- Responsibilities: Bootstrap embedded Tomcat, load context.

**Frontend Entry:**
- Location: `src/main.jsx`
- Triggers: Browser loading `index.html`
- Responsibilities: Render React Root, inject Providers (Theme, Route, QueryClient).

## Error Handling

**Strategy:** Global Exception Handling (Backend) and React Error Boundaries (Frontend).

**Patterns:**
- Backend: `@RestControllerAdvice` (`GlobalExceptionHandler.java`) traps thrown domain exceptions (`ResourceNotFoundException`, `InvalidCredentialsException`) and transforms them into standardized JSON error responses.
- Frontend: Axios interceptors interpret error responses; components react gracefully via UI alerts or boundary components.

---

*Architecture analysis: 2026-04-13*
*Update when major patterns change*
