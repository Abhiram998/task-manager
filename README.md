# TaskManager Pro

A production-ready Full Stack Task Management Application built with Next.js 14 (App Router), TypeScript, Prisma ORM, and PostgreSQL.

## 🚀 Features

- **Custom JWT Authentication**: Secure login/register with `jose` and `bcryptjs`.
- **HTTP-only Cookies**: JWT stored securely with `SameSite=strict` and `Secure` flags.
- **Task Management (CRUD)**: Create, Read, Update, and Delete tasks with ownership verification.
- **Advanced Filtering**: Filter by status (Pending/Completed).
- **Global Search**: Case-insensitive search across task titles.
- **Server-side Pagination**: Optimized data fetching for performance.
- **Rate Limiting**: Integrated middleware to prevent abuse.
- **Premium UI**: Sleek dark-mode interface built with Tailwind CSS and Lucide icons.
- **Validation**: Strict input validation using Zod.

## 🛠️ Architecture

The project follows a clean modular architecture:

- `app/api`: Route handlers following separation of concerns.
- `services/`: Business logic layer.
- `controllers/`: (Merged into API routes for Next.js convention, calling services).
- `lib/`: Shared utilities (auth, prisma, exceptions, validations).
- `components/`: Reusable UI components.
- `middleware.ts`: Centralized auth protection and rate limiting.

## 📦 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase/Local)
- **ORM**: Prisma
- **Auth**: Custom JWT (jose)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Validation**: Zod
- **Notifications**: Sonner

## 🚦 Getting Started

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db"
   JWT_SECRET="your-strong-secret"
   NODE_ENV="development"
   ```

3. **Database Setup**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🔒 Security Summary

- **SQL Injection**: Prevented by Prisma's parameterized queries.
- **XSS**: Next.js native protection and sanitized outputs.
- **CSRF**: Mitigated by SameSite=Strict cookies.
- **Rate Limiting**: Basic in-memory implementation in middleware.
- **Auth**: Passwords hashed with bcrypt (salt rounds: 12).

## 📄 API Documentation

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login and receive auth cookie.
- `GET /api/auth/me`: Get current authenticated user.
- `GET /api/tasks`: List user tasks (supports `page`, `limit`, `status`, `search`).
- `POST /api/tasks`: Create a new task.
- `PUT /api/tasks/[id]`: Update task title, description, or status.
- `DELETE /api/tasks/[id]`: Delete a specific task.

## 🔑 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

- `DATABASE_URL`: Your PostgreSQL connection string (Supabase recommended).
- `JWT_SECRET`: A long, random string used to sign your JSON Web Tokens.
- `NODE_ENV`: Set to `development` during local testing and `production` when deploying.

## 🔒 JWT Authentication Flow

This application implements a secure, custom JWT flow:

1.  **Registration/Login**: User submits credentials to the server.
2.  **Verification**: For login, `AuthService` compares the password against the bcrypt hash.
3.  **Token Generation**: Upon success, a JWT is signed using `jose` with a 24-hour expiration.
4.  **Cookie Attachment**: The token is sent back to the browser in an `auth-token` cookie with the following flags:
    -   `HttpOnly`: Prevents client-side scripts from accessing the token (XSS protection).
    -   `Secure`: Ensures the cookie is only sent over HTTPS (In production).
    -   `SameSite=Strict`: Protects against Cross-Site Request Forgery (CSRF).
5.  **Middleware Authorization**: For every protected request, `middleware.ts` intercepts the request, verifies the JWT signature, and identifies the user.
6.  **Context**: The verified `userId` is then used in the Service layer to ensure multi-user isolation (IDOR protection).

---

Built with ❤️ by your AI Coding Assistant.
