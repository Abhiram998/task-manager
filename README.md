# Task Management System Technical Documentation

### 1. System Overview
The Task Management System is a vertically integrated full-stack application designed for secure personal task orchestration. The system provides authenticated users with interfaces for task lifecycle management, including persistence, categorization, and full-text search. The functional scope is restricted to single-user ownership models, ensuring data isolation and high-integrity state transitions.

### 2. Architectural Design
The system utilizes a modular architecture built on the Next.js App Router framework.
- **High-Level Architecture**: Follows a layered pattern separating the presentation layer from the business logic and persistence layers.
- **Separation of Concerns**: UI components are decoupled from data fetching logic. API routes act as controllers, delegating complex operations to a dedicated Service Layer.
- **Request Lifecycle**: Incoming requests are intercepted by a global Proxy Layer for authentication verification and rate limiting. Validated requests are routed to API handlers, processed through services, and persisted via an ORM.
- **Service-Layer Responsibilities**: Standalone service classes (AuthService, TaskService) encapsulate business rules, ensuring that API handlers remain thin and focused on HTTP concerns.
- **Database Interaction Model**: Implements a repository-style pattern through Prisma ORM, utilizing type-safe queries and transaction management.

### 3. Authentication Mechanism
The system implements a stateless authentication model using JSON Web Tokens (JWT).
- **JWT Signing Process**: Tokens are signed using the HS256 algorithm. The payload contains the unique user identifier and issuance timestamp.
- **Token Verification**: Verification occurs at the edge via a global proxy. Tokens are validated against a server-side secret prior to downstream routing.
- **Cookie Configuration**:
  - `HttpOnly`: Mitigates unauthorized access via client-side scripts.
  - `Secure`: Ensures transmission occurs exclusively over encrypted channels (HTTPS).
  - `SameSite=Strict`: Provides defense-in-depth against Cross-Site Request Forgery (CSRF).
- **Expiration Handling**: Tokens carry a 24-hour Time-to-Live (TTL). Expired tokens trigger immediate session termination at the proxy layer.
- **Security Reasoning**: This implementation prioritizes resistance to common web vulnerabilities while maintaining the performance benefits of stateless sessions.

### 4. Authorization Model
The system enforces a strict ownership-based authorization model.
- **Ownership Enforcement**: Every mutation request is validated against the authenticated user identifier.
- **IDOR Prevention**: Application logic prevents Insecure Direct Object Reference (IDOR) by explicitly checking resource ownership before execution of PUT or DELETE operations.
- **Query-Level User Isolation**: Database queries for data retrieval are scoped by the `userId` in the `WHERE` clause, ensuring that users can neither view nor modify records belonging to other entities.
- **Service-Layer Validation**: Authorization checks are performed within the Service Layer, providing a centralized enforcement point and reducing the risk of accidental exposure in the API layer.

### 5. API Design Specification
The API follows RESTful principles, utilizing standard HTTP methods and status codes.

#### Endpoints
- `POST /api/auth/register`: User credential registration. Returns 201 on success.
- `POST /api/auth/login`: Identity verification and session issuance. Returns 200 on success.
- `GET /api/tasks`: Retrieval of scoped tasks. Supports `page`, `limit`, `status`, and `search` parameters.
- `POST /api/tasks`: Persistence of a new task entity.
- `PUT /api/tasks/{id}`: Modification of an existing task entity.
- `DELETE /api/tasks/{id}`: Removal of a task entity from the persistent store.

#### Error Handling
The system implements structured JSON error responses:
```json
{
  "message": "Validation failed",
  "errors": [ ... ]
}
```
Status codes are mapped objectively: `401` for unauthenticated requests, `403` for unauthorized access attempts, and `400` for validation failures.

### 6. Data Model and Indexing Strategy
The persistence layer is modeled in PostgreSQL.

#### User Schema
- `id`: UUID (Primary Key)
- `email`: String (Unique Index)
- `password`: String (Bcrypt Hash)

#### Task Schema
- `id`: UUID (Primary Key)
- `title`: String
- `description`: Text (Optional)
- `status`: Enum (PENDING, COMPLETED)
- `userId`: UUID (Foreign Key)

#### Indexing Rationale
- **userId Index**: Optimized for high-concurrency read operations scoped to individual users.
- **status Index**: Facilitates performant filtering for dashboard metrics and status-based aggregation.
- **Composite Considerations**: The schema is designed to scale with B-Tree indexing on primary and foreign keys, ensuring sub-millisecond query performance on standard workloads.

### 7. Security Controls
- **Password Hashing**: Utilizes Bcrypt with a work factor of 12 salt rounds, ensuring resistance to brute-force and rainbow table attacks.
- **SQL Injection Mitigation**: Prevented through the use of parameterized queries and type-safe abstraction via Prisma.
- **Input Validation**: Enforced via Zod schemas at the API entry point, validating data types, constraints, and formats.
- **XSS Prevention**: Mitigated through React’s automatic escaping and the enforcement of HttpOnly cookie flags.
- **Environment Handling**: Configuration is strictly managed through encrypted environment variables, with logical separation between development and production secrets.

### 8. Deployment Architecture
- **Hosting Environment**: Vercel (Serverless).
- **Database Infrastructure**: Supabase (PostgreSQL with PgBouncer for connection pooling).
- **Configuration Management**: Secrets are stored in Vercel’s Environment Variable store and injected at runtime.
- **Migration Strategy**: Schema evolution is managed via Prisma Migrations, ensuring consistent state across deployment environments.

### 9. Operational Considerations
- **Scalability**: The system is vertically scalable through database tiering and horizontally scalable through serverless function execution.
- **Limitations**: In-memory rate limiting is currently utilized. In a production environment with high traffic, this would be migrated to a distributed Redis store.
- **Enterprise Readiness**: For enterprise-scale deployment, the system would require the integration of a centralized logging provider (e.g., Axiom, Datadog) and more granular RBAC (Role-Based Access Control) models.

### 10. Local Development and Reproducibility
Prerequisites: Node.js 18+, PostgreSQL.

#### Setup Procedure
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Configure `.env` with `DATABASE_URL`, `JWT_SECRET`, and `NODE_ENV`.
4. Initialize database: `npx prisma db push`.
5. Run development server: `npm run dev`.
