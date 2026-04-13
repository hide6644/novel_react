# Concerns

## 1. Technical Debt
- **Frontend Testing**: Currently, there is an absence of formal, automated testing pipelines configured for the React frontend (missing Jest/Vitest setups). Test development will slow down subsequent UI development layers until remedied.
- **Backend Logging**: General structured logs exist, though correlation IDs across services (MDC) or external tracing tools might need to be verified as the scale increases.

## 2. Fragile Areas & Known Issues
- Currently, no major unresolved TODOs or logic bugs recorded. 
- Ensure proper configuration of MariaDB environment parameters via .env since placeholder defaults are referenced in local property structures.

## 3. Security
- Default placeholder credentials or insecure CORS endpoints should be strictly prohibited in production branches. 
- Validate the explicit behavior of JWT Token lifetimes if `app.security.password-expiration-days` interacts closely with local session lifespans.

## 4. Performance
- Application scales reasonably relying on typical Spring Virtual Threads configurations (Java 25).
- Ensure frontend leverages Tanstack Query caching optimally.
