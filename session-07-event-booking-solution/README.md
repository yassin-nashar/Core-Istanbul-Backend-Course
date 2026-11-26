# Secure Event Booking API — Instructor Solution

Corrected reference for the Event Booking security audit. Stack: Express 5, strict TypeScript/ESM, Prisma/PostgreSQL, Zod, Argon2id, rotating refresh tokens, Helmet, and express-rate-limit.

Setup: `npm install`, copy `.env.example` to `.env`, and use dedicated solution and solution-test databases. Run `npm run prisma:generate`, `npm run prisma:migrate`, `npm run build`, `npm run seed`, then `npm run dev`. Before `npm test`, migrate the separate test database with `$env:DATABASE_URL=$env:TEST_DATABASE_URL; npm run prisma:migrate` in PowerShell (or `DATABASE_URL="$TEST_DATABASE_URL" npm run prisma:migrate` in a POSIX shell). The test database name must contain `test`.

Events are public to read and ADMIN-only to mutate. Authenticated users create bookings for themselves. USER booking queries include ownership in Prisma; ADMIN can see/cancel all. Cross-user access returns 404. `/api/users/me` explicitly selects safe fields. Events with bookings return 409 on deletion. Helmet precedes routes; general and authentication limits are configurable by `API_RATE_LIMIT_MAX` and `AUTH_RATE_LIMIT_MAX`.

Seed accounts use `ClassroomPassword123`: `admin@example.com`, `user1@example.com`, `user2@example.com`. Commands: `npm run typecheck`, `npm run build`, `npm test`. See `INSTRUCTOR_GUIDE.md`, the Postman files, and `EVENT_BOOKING_BUILD_PROMPT.md`.
