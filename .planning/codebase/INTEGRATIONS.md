# Integrations

**Analysis Date:** 2026-04-13

## Internal Dependencies (Monorepo)
- React Frontend -> Spring Boot Backend (JSON API over HTTP)

## External Services

**MariaDB:**
- Purpose: Primary application database.
- Integration Method: `mariadb-java-client` driver via Spring Data JPA.
- Configuration: Managed by `application.properties/yml` connection strings.

## APIs Consumed

*(None currently mapped to external internet services beyond standard package repositories).*

## Infrastructure

**Local Development Environment:**
- JDK 25 & Maven context execution.
- Node.js & Vite local dev server execution.
- Configured to run on standard localhost ports (`localhost:8080` for backend, `localhost:5173` for frontend).

**Planned/Implicit Infrastructure:**
- Embedded Tomcat (provided by Spring Boot) instances for web traffic.

---

*Integrations analysis: 2026-04-13*
