# Session 7 — Support Ticket API with RBAC and Resource Ownership

An independent teaching reference built from the authenticated Support Ticket API. It preserves registration, Argon2id login, JWT access tokens, rotating refresh cookies, reuse detection, and logout, then adds current-database roles and ticket ownership.

- Reusable build prompt: [`SESSION_7_RBAC_IMPLEMENTATION_PROMPT.md`](SESSION_7_RBAC_IMPLEMENTATION_PROMPT.md)
- Teaching walkthrough: [`SOLUTION_GUIDE.md`](SOLUTION_GUIDE.md)
- Postman collection: [`postman/session-07-rbac.postman_collection.json`](postman/session-07-rbac.postman_collection.json)

## Learning objectives

- Separate authentication (who are you?) from authorization (what may you do?).
- Enforce `USER` and `ADMIN` roles through reusable middleware.
- Derive ownership only from the authenticated identity.
- Put ownership predicates inside database mutations to avoid check-then-act gaps.
- Return 404 for another user's resource and 403 for a forbidden action.

## Stack and structure

Node.js, Express 5, strict TypeScript/ESM, Prisma 7, PostgreSQL, Zod, Argon2id, JWT, Vitest, and Supertest. Routes compose authentication/authorization middleware; controllers handle HTTP; services enforce ownership; `lib` holds security primitives; Prisma defines roles, relations, and migrations.

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run build
npm run seed
npm run dev
```

Use `Copy-Item .env.example .env` on PowerShell. Generate `JWT_SECRET` with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

This project must use databases separate from the original authentication project. Configure `session_07_support_tickets_rbac` for development and `session_07_support_tickets_rbac_test` for tests. The test guard refuses destructive cleanup unless the database name contains `test`.

Apply migrations to the test database explicitly. Bash: `DATABASE_URL="$TEST_DATABASE_URL" npx prisma migrate deploy`. PowerShell: `$env:DATABASE_URL=$env:TEST_DATABASE_URL; npx prisma migrate deploy`. Then run:

```bash
npm test
npm run typecheck
npm run build
```

## Development accounts

Run `npm run seed`. These classroom-only accounts all use `ClassroomPassword123`:

| Email | Role |
|---|---|
| `admin@example.com` | ADMIN |
| `user1@example.com` | USER |
| `user2@example.com` | USER |

The repeatable seed creates at least five varied tickets for each USER and does not delete existing data.

## Authorization policy

| Action | USER | ADMIN |
|---|---|---|
| Create | Creates own ticket | Creates own ticket |
| List | Own tickets | All tickets |
| View | Own tickets | Any ticket |
| Update | Own tickets | Any ticket |
| Delete | 403 Forbidden | Any ticket |

All `/api/tickets` endpoints require a Bearer access token. A USER receives 404 when requesting another user's ticket so the API does not disclose its existence. Registration always relies on the database default `USER`; input such as `role: "ADMIN"` is discarded. The authorization middleware reads the current role from PostgreSQL on every authenticated request, so role changes do not wait for JWT expiry.

Ownership is assigned from `req.user.id`; client `ownerId` is never accepted by create/update schemas. USER updates use a database predicate containing both ticket ID and owner ID. ADMIN operations intentionally omit the ownership predicate.

## API

Authentication endpoints are unchanged: `POST /api/auth/register`, `/login`, `/refresh`, and `/logout`.

| Method | Endpoint | Success |
|---|---|---|
| GET | `/api/tickets` | 200 filtered by policy |
| GET | `/api/tickets/:id` | 200 or hidden 404 |
| POST | `/api/tickets` | 201, authenticated user owns it |
| PATCH | `/api/tickets/:id` | 200 or hidden 404 |
| DELETE | `/api/tickets/:id` | 204 ADMIN; 403 USER |

Errors keep `{ "error": { "message": "..." } }`. This remains an educational API: it has fixed roles, no permission editor, no frontend, and no additional CORS/CSRF/rate-limit/Helmet lesson content.

## Migration strategy

The RBAC migration adds `UserRole`, defaults existing users to `USER`, adds indexed `Ticket.ownerId`, and creates a restrictive user relation. It deliberately aborts if an existing target database contains ownerless tickets. This prevents silent deletion or arbitrary reassignment. For real legacy data, backfill verified owner IDs in a reviewed migration before setting `ownerId` non-null. A fresh dedicated RBAC database needs no backfill.

## Postman

Import the included collection, run the three login requests, and let scripts save `user1Token`, `user2Token`, and `adminToken`. Folders demonstrate each identity, expected 401/403/404 results, and cross-user ownership. Postman manages refresh cookies; use separate cookie jars or log in again when switching demonstrations.
