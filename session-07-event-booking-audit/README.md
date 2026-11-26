# Event Booking API Security Audit

> **WARNING:** Intentionally insecure local classroom software. It refuses production mode, binds to `127.0.0.1`, uses synthetic data, and must never be deployed publicly.

This 45-minute exercise uses Node.js, Express, TypeScript, PostgreSQL, Prisma, Zod, JWT, and Argon2id. Install with `npm install`, copy `.env.example` to `.env`, and create dedicated audit and audit-test databases. Run `npm run prisma:generate`, `npm run prisma:migrate`, `npm run build`, `npm run seed`, then `npm run dev`. Before `npm test`, migrate the separate test database with `$env:DATABASE_URL=$env:TEST_DATABASE_URL; npm run prisma:migrate` in PowerShell (or `DATABASE_URL="$TEST_DATABASE_URL" npm run prisma:migrate` in a POSIX shell). The test database name must contain `test`.

Audit these categories without assuming the implementation is correct: Authentication, RBAC, Resource Ownership, JWT Security, Sensitive Data Protection, Security Headers, and Rate Limiting.

Workflow: inspect, identify, reproduce, fix, and verify. Duration: 45 minutes (5 inspection, 10 investigation, 20 implementation, 10 review). Use AI to explain root causes and propose tests. Do not add CORS, SQL injection, XSS, CSRF, Firebase, or Supabase work.

| Action | Guest | USER | ADMIN |
|---|---|---|---|
| View events | Yes | Yes | Yes |
| Manage events | No | No | Yes |
| Create booking | No | Own | Own |
| List/view/cancel bookings | No | Own | All |
| View `/api/users/me` | No | Yes | Yes |

Endpoints: `/api/auth/{register,login,refresh,logout}`, `/api/events`, `/api/events/:id`, `/api/bookings`, `/api/bookings/:id`, `/api/users/me`. Event deletion with bookings must return 409. Duplicate user/event bookings are rejected.

Development accounts after `npm run seed` use `ClassroomPassword123`: `admin@example.com`, `user1@example.com`, `user2@example.com`. Import the student Postman files from `postman/`. The reusable construction prompt is `EVENT_BOOKING_BUILD_PROMPT.md`.
