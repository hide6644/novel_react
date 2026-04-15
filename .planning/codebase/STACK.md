# Technology Stack

**Analysis Date:** 2026-04-13

## Languages

**Primary:**
- Java 25 - Backend application code
- JavaScript (ES6+ / JSX) - Frontend application code

**Secondary:**
- HTML/CSS - Web layout (primarily via MUI)

## Runtime

**Environment:**
- JDK 25 - Backend runtime
- Node.js (20.x+) - Frontend dev runtime & build, browser for execution

**Package Manager:**
- Maven 3.x - Backend dependencies (`pom.xml`)
- npm 10.x - Frontend dependencies (`package.json`, `package-lock.json`)

## Frameworks

**Core:**
- Spring Boot 4.0.5 - Backend web server, IoC container, Data JPA, Security
- React 19.2.5 - Frontend UI library

**Testing:**
- JUnit / Spring Boot Test - Backend unit/integration tests
- Vitest 4.1.4 - Frontend unit/smoke tests
- React Testing Library 16.2.0 - Frontend DOM tests

**Build/Dev:**
- Vite 8.0.8 - Frontend bundling & dev server
- Maven Compiler Plugin 3.15.0 - Java build
- ESLint 9.x - Frontend code linting

## Key Dependencies

**Critical:**
- MariaDB Java Client (`mariadb-java-client`) - Database access
- Spring Security - Authentication & Authorization
- `@tanstack/react-query` (v5.99) - Frontend data fetching & state management
- `react-router-dom` (v7.14) - Frontend routing
- `react-hook-form` (v7.72) & `zod` (v4.3) - Frontend form validation

**Infrastructure:**
- `@mui/material` (v9.0) - UI Component Library
- `axios` (v1.15) - HTTP Client

## Configuration

**Environment:**
- `application.yml` or `application.properties` (Spring Boot environment config)
- Vite / `.env` variables (Frontend API base URL settings etc.)

**Build:**
- `pom.xml` - Maven dependencies and build plugins
- `vite.config.js` - Vite bundling config
- `eslint.config.js` (assumed) - ESLint rules

## Platform Requirements

**Development:**
- Cross-platform (Windows, macOS, Linux) with JDK 25 & Node.js
- Local MariaDB Server

**Production:**
- Standard Java Web container or standalone executable JAR
- Static file hosting for Frontend React build

---

*Stack analysis: 2026-04-13*
*Update after major dependency changes*
