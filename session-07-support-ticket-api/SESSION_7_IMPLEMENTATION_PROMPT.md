# Reusable implementation prompt — Session 7

Act as a senior backend developer, security-conscious engineer, and teaching assistant. Upgrade an existing Session 6 Support Ticket REST API into a complete Session 7 authenticated API. Extend existing code; do not rebuild it or add unrelated functionality.

Preserve Node.js, Express 5, strict TypeScript, ESM/NodeNext, Prisma 7 PostgreSQL configuration, Zod, routes/controllers/services, all Ticket fields and UUID IDs, enum values, validation, CRUD semantics, status codes, and `{ "error": { "message": "..." } }`. Require authentication on every ticket route.

Add Argon2id password hashing, JWT HS256 access tokens (15 minutes, `sub`, issuer, audience, explicit access marker), and opaque 256-bit refresh tokens sent only in an HttpOnly cookie. Store only SHA-256 refresh hashes. Implement registration, login, atomic rotation, fixed seven-day sessions, multiple independent sessions, revocation, family-based reuse detection, concurrency safety, and idempotent logout. Cookie settings: HttpOnly, Secure in production, SameSite Strict, path `/api/auth`, and expiration no later than the original session.

Build strict Bearer middleware using `jwt.verify`, HS256 restriction, required claims, typed `req.user`, 401 responses, and `WWW-Authenticate`. Authentication proves identity only; do not add permissions.

Extend Prisma non-destructively with User and RefreshToken models, relationships, unique constraints, indexes, replacement tracking, and consumption/revocation timestamps. Preserve migrations, Ticket data, seeding, Prisma adapter, and generated-client conventions. Validate environment variables at startup and provide a safe `.env.example`.

Test registration, validation, duplicate races, Argon2id hashes and salt differences, login, sensitive-field exclusion, JWT claims/signature/tampering/expiry/issuer/audience/algorithm, all protected Ticket CRUD, raw-token absence, rotation, reuse revocation, concurrency, fixed expiration, expiry/revocation, independent sessions, and logout. Use an isolated database and never claim unexecuted checks.

Provide an importable Postman collection with Authentication, Protected Ticket CRUD, Authentication Error Cases, and Refresh Token Lifecycle folders; scripts must capture access tokens and cookies must use Postman's manager. Write a student-friendly README covering setup, architecture, flows, API, client in-memory access-token behavior, security decisions, Postman sequence, and limitations. Explain Argon2id versus SHA-256, refresh rotation, cookie properties, access-token logout limitations, and authentication versus authorization.

Do not implement RBAC, ownership, permissions, Redis, JWT denylisting, Helmet, rate limiting, Firebase, Supabase, OAuth, email verification, password reset, MFA, or a frontend. Produce complete readable code without TODOs, bypass endpoints, or hardcoded secrets.
