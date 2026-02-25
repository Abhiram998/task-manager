# Task Management System

### Project Overview
A multi-user task management system providing secure persistence, search, and activity tracking. The system manages create, read, update, and delete (CRUD) operations for user tasks while enforcing strict data isolation and authentication boundaries.

### System Architecture
The application is built on the Next.js App Router framework. It implements a layered architecture to ensure separation of concerns:
- Client Layer: React components managing state and UI.
- API Layer: Request handlers responsible for input validation and HTTP responses.
- Service Layer: Business logic encapsulated in standalone classes (AuthService, TaskService) to ensure testability and reuse.
- Data Layer: Prisma ORM interfacing with a PostgreSQL database.

Authentication and authorization are managed through a centralized proxy layer (formerly middleware) that intercepts protected routes to verify session integrity before reaching the business logic.

### Authentication Design
The system utilizes JSON Web Tokens (JWT) for stateless session management.
- Token signing: Tokens are signed with HS256 using a server-side secret key.
- Storage: Tokens are stored in a client-side HttpOnly cookie.
- Configuration: Cookies are configured with SameSite=Strict and Secure flags.
This design prevents Cross-Site Scripting (XSS) from accessing the token and mitigates Cross-Site Request Forgery (CSRF).

### Authorization Strategy
Authorization is enforced through ownership validation at the service layer.
- User Isolation: Every database query includes a userId filter derived from the verified JWT.
- IDOR Prevention: Mutations (update/delete) perform a pre-check to ensure the resource belongs to the requesting user before modification.
Database-level constraints and Prisma-managed relations ensure that mismatched records are unreachable.

### API Design
Endpoints return structured JSON responses with appropriate HTTP status codes.

- POST /api/auth/register: User account creation.
- POST /api/auth/login: Session initiation.
- GET /api/tasks: Paginated task retrieval with search (`search=`) and filter (`status=`) support.
- POST /api/tasks: Resource creation.
- PUT /api/tasks/{id}: Resource modification.
- DELETE /api/tasks/{id}: Resource removal.

Example Request: `GET /api/tasks?page=1&limit=10&status=PENDING`
Example Response:
```json
{
  "tasks": [...],
  "pagination": { "total": 25, "totalPages": 3, "page": 1 }
}
```

### Database Schema
The schema is defined in PostgreSQL and managed through Prisma.

Model: User
- id (UUID, PK)
- email (String, Unique)
- password (Hashed)
- tasks (Relation)

Model: Task
- id (UUID, PK)
- title (String)
- description (String, Optional)
- status (Enum: PENDING, COMPLETED)
- userId (UUID, FK)

Indexing:
- Index on userId to optimize filtered retrieval.
- Index on status to support high-performance dashboard filtering.

### Security Considerations
- Password Security: Hashing is performed using bcrypt with 12 salt rounds.
- SQL Injection: Mitigated by the ORM's use of parameterized queries for all database interactions.
- XSS Mitigation: React's default escaping combined with HttpOnly cookies prevents typical injection vectors.
- Environment Variables: Sensitive data is restricted to server-side logic and never exposed to the client bundle.

### Deployment Details
- Hosting: Vercel.
- Database: Supabase (PostgreSQL).
- Session Secret: Managed via JWT_SECRET environment variable.
- Production Flags: Cookies are restricted to HTTPS through the Secure flag in production environments.

### Local Development Setup
1. Install dependencies:
   `npm install`
2. Configure environment:
   Create a .env file with DATABASE_URL, JWT_SECRET, and NODE_ENV.
3. Synchronize database schema:
   `npx prisma db push`
4. Generate client:
   `npx prisma generate`
5. Start development server:
   `npm run dev`

### Design Tradeoffs
1. Rate Limiting: An in-memory store is used in the proxy layer for simplicity. In a distributed production environment, this would be replaced with a Redis-backed store to maintain consistency across container instances.
2. Soft Deletes: The current implementation performs hard deletes. Systems usually implement soft deletes to allow for data recovery.
3. Password Reset: For the scope of this implementation, password recovery flows were omitted to focus on core authentication and CRUD security.
