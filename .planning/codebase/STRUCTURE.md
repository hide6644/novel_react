# Codebase Structure

**Analysis Date:** 2026-04-13

## Root Directory

The project is structured entirely as a decoupled backend and frontend monorepo-style setup.

```text
/
├── backend/          # Java / Spring Boot API Server
├── frontend/         # React / Vite Client Application
├── .planning/        # GSD execution planning and metadata
└── .agent/           # AI Agent localized skills and templates
```

## Backend Structure (`/backend/src/main/java`)

Follows standard Spring Boot domain-driven or layer-driven packaging.

**Key Directories:**
- `com.example.novel.controller/`: API Routing and Endpoints (`NovelController`, `AuthController`).
- `com.example.novel.service/`: Transactional business logic (`NovelService`, `UserService`).
- `com.example.novel.repository/`: Interfaces extending Spring Data JPA (`NovelRepository`).
- `com.example.novel.entity/`: JPA data models representing MariaDB tables (`Novel`, `User`, `Author`).
- `com.example.novel.dto/`: Request/Response payload objects (`LoginRequest`, `NovelResponse`).
- `com.example.novel.security/`: Authentication configuration and filters.
- `com.example.novel.exception/`: Global and custom exception definitions.
- `com.example.novel.config/`: Java-centric configuration classes.
- `com.example.novel.aspect/`: AOP logging and performance monitoring components.

## Frontend Structure (`/frontend/src`)

Follows a feature-separated standard React SPA architecture.

**Key Directories:**
- `api/`: External service definitions and Axios instances (`axios.js`).
- `components/`: Generic and domain-specific reusable React views.
  - `common/`: Highly generic inputs and UI boundaries (`FormTextField`, `SearchBox`).
- `context/`: React Context providers (`AuthContext.jsx`).
- `hooks/`: Custom state and data-fetching hooks (`useCrud.js`).
- `locales/`: Internationalization JSON bundles for `i18next` (`en.json`, `ja.json`).
- `pages/`: Routable, high-level screen components (`NovelList`, `Profile`, `Login`).
- `theme.js`: Material-UI application theme setup.
- `App.jsx` & `main.jsx`: Core routing and rendering bootstrap.

## Core Domain Models

Based on backend persistence entities:

1. **User**: application users, utilizing a `Role` enumeration.
2. **Author**: creators / writers within the system.
3. **Novel**: stories associated with users/authors.

## Configuration Files

- `/backend/pom.xml`: Maven dependency configuration and Java build instructions.
- `/frontend/package.json`: NPM package management and scripts.
- `/frontend/vite.config.js`: Vite build, plugin, and test runner configurations.

---

*Structure analysis: 2026-04-13*
*Update when major folders or domain models change*
