# Directory Structure

## Repository Layout
```
/
├── .agent/         # AI agent configuration and skills
├── backend/        # Spring Boot Java application
├── frontend/       # React SPA application
├── docker-compose.yml # Infrastructure orchestration
```

## Backend Structure (`backend/`)
```
backend/
├── pom.xml                 # Maven build configuration
├── src/main/
│   ├── java/com/example/novel/
│   │   ├── aspect/         # Spring AOP aspects
│   │   ├── config/         # Spring configuration classes
│   │   ├── controller/     # REST API endpoints
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA Domain models
│   │   ├── exception/      # Global error handling
│   │   ├── mapper/         # Object mapping logic
│   │   ├── repository/     # JPA Repositories
│   │   ├── security/       # Spring Security configs
│   │   ├── service/        # Business logic services
│   │   └── NovelApplication.java # Application entry point
│   └── resources/
│       ├── application.properties # App configuration
│       └── logback-spring.xml     # Logging configuration
├── sql/                    # SQL initialization scripts
└── logs/                   # Generated application logs
```

## Frontend Structure (`frontend/`)
```
frontend/
├── package.json            # Node.js dependencies and scripts
├── vite.config.js          # Vite build configuration
├── eslint.config.js        # ESLint flat configuration
├── src/
│   ├── api/                # Axios client and API request functions
│   ├── components/         # Reusable UI components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── locales/            # i18n translation files
│   ├── pages/              # Route level components
│   ├── App.jsx             # Main application component & router 
│   ├── main.jsx            # React root mount point
│   ├── i18n.js             # i18next configuration
│   └── theme.js            # MUI Theme configuration
```

## Naming Conventions
- **Java**: `PascalCase` for Classes/Interfaces, `camelCase` for instances and methods. Structure favors package-by-layer (though could evolve to package-by-feature).
- **React**: `PascalCase` for component files (`App.jsx`), `camelCase` for utility/logic files (`theme.js`, `i18n.js`). Directories are generally camelCase.
