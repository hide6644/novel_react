# Technology Stack

## 1. Backend
- **Language**: Java 25
- **Framework**: Spring Boot 4.0.3
- **Core Components**:
  - Spring Boot Starter Web
  - Spring Boot Starter Data JPA
  - Spring Boot Starter Security
  - Spring Boot Starter Validation
- **Database**: MariaDB
- **Tools & Utilities**:
  - Lombok (v1.18.42)
  - Maven Compiler Plugin (v3.15.0)

## 2. Frontend
- **Language**: JavaScript / JSX
- **Framework**: React 19.2.4
- **Build Tool**: Vite v7.3.1
- **UI Library**: MUI v7.3.8 (Material UI)
- **Styling**: Emotion (@emotion/react, @emotion/styled)
- **State & Data Fetching**: @tanstack/react-query (v5.90.21)
- **Form Handling**: react-hook-form (v7.71.2) with Zod (v4.3.6) validation
- **Routing**: react-router-dom (v7.13.1)
- **Internationalization**: i18next (v25.8.14) & react-i18next (v16.5.4)
- **HTTP Client**: Axios (v1.13.6)

## 3. Infrastructure & Deployment
- Docker (using `docker-compose.yml` to orchestrate services)
- Node/npm environment for frontend packaging.

## 4. Environment Context
- Spring Profiles configuring database URL, username, password and CORS via `backend/src/main/resources/application.properties`.
- Vite environments for frontend builds.
