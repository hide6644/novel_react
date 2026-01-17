# Novel Search System

A full-stack web application for managing and searching novels, built with modern technologies including Spring Boot and React.

## Overview

This project is a comprehensive system designed to handle novel data, authors, and user authentication. It features a robust backend API and a responsive, internationalized frontend interface.

## Tech Stack

### Backend
- **Java**: 25
- **Framework**: Spring Boot 4
- **Database**: MariaDB
- **Security**: Spring Security
- **Tools**: Maven, Lombok

### Frontend
- **Framework**: React 19 (Vite)
- **UI Library**: Material UI (MUI) v7
- **State Management**: TanStack Query (React Query) v5
- **Routing**: React Router
- **Forms**: React Hook Form + Zod
- **Internationalization**: i18next
- **HTTP Client**: Axios

## Features
- **User Authentication**: Secure login and registration system.
- **Novel Management**: Create, read, update, and delete novels.
- **Author Management**: Manage author profiles and link them to novels.
- **Internationalization (i18n)**: Full support for English and Japanese languages.
- **Responsive Design**: Modern UI adapted for various screen sizes.

## Environment Variables

The application requires the following environment variables to be set.

### Backend (Spring Boot)

These variables are referenced in `backend/src/main/resources/application.properties`. You need to set these when running the backend locally.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DB_URL` | JDBC URL for MariaDB | `jdbc:mariadb://localhost:3306/novel_db` |
| `DB_USERNAME` | Database username | `novel` |
| `DB_PASSWORD` | Database password | `password` |
| `SQL_INIT_MODE` | Database initialization mode (`always` or `never`) | `always` |
| `CORS_ALLOWED_ORIGINS_URL` | Allowed CORS origins (comma separated) | `http://localhost:5173` |

### Docker Compose

These variables are configured in the `.env` file in the project root and are used by `docker-compose.yml`.

| Variable | Description | Default Example |
| :--- | :--- | :--- |
| `DB_NAME` | Database name | `novel_db` |
| `DB_USER` | Database username | `novel` |
| `DB_PASS` | Database password | `password` |
| `DB_ROOT_PASS` | MariaDB root password | `password` |

## Getting Started

### Prerequisites
- Java JDK 25
- Node.js (Latest LTS recommended)
- MariaDB Server

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Set the necessary environment variables (see [Environment Variables](#environment-variables)) or configure `src/main/resources/application.properties`.
3.  Build and run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
    The backend server will start on `http://localhost:8080`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend application will be accessible at `http://localhost:5173`.

## Logging
The application is configured to output logs to the `logs/` directory:
- `app.log`: General application logs.
- `error.log`: Error-level logs.
- `debug.log`: Debug-level logs for the application package.
- `sql.log`: SQL statements and Hibernate logs.

## License
[MIT](LICENSE)
