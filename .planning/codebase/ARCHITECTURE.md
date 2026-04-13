# Architecture

## 1. System Pattern
- **Backend**: Spring Boot MVC layered architecture.
- **Frontend**: Single Page Application (SPA) using React and Vite.

## 2. Layers & Data Flow

### Backend (Java/Spring Boot)
1. **Controller Layer (`backend/src/main/java/.../controller/`)**: Exposes RESTful APIs, handles HTTP requests/responses, and validates incoming data.
2. **Service Layer (`backend/src/main/java/.../service/`)**: Contains the core business logic.
3. **Repository Layer (`backend/src/main/java/.../repository/`)**: Interfaces extending Spring Data JPA providing database access.
4. **Data Models (`backend/src/main/java/.../entity/` & `dto/`)**: Entities map directly to database tables. DTOs are used for client-server data transfer, mapped via mappers (`.../mapper/`).
5. **Cross-Cutting Concerns**: 
   - `security/`: Handles Spring Security, standard role-based access or token verification.
   - `exception/`: Global exception handling (ControllerAdvice).
   - `config/`: Application configuration beans.
   - `aspect/`: AOP implementations.

### Frontend (React/Vite)
1. **Entry Points (`frontend/src/main.jsx` & `App.jsx`)**: Bootstrap the application, configure React Router, global providers (MUI Theme, React Query Client, i18n).
2. **Pages (`frontend/src/pages/`)**: Distinct route-level components composed of smaller components.
3. **Components (`frontend/src/components/`)**: Reusable UI elements built on top of Material UI.
4. **State & API (`frontend/src/api/` & hooks)**: Uses Axios for HTTP calls and Tanstack React Query for caching/server state management. Local state is managed via React Hooks. Global state might use `context/`.
5. **Form Handling**: Handled locally within components using React Hook Form and Zod schemas.

## 3. Communication
- REST API calls from the frontend via Axios to the backend.
- JSON data formats exchanged between the frontend and backend.
