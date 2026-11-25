# Session 7 — Authenticated Support Ticket API

A teaching reference solution that upgrades the Session 6 Express/Prisma ticket API with secure authentication. Authentication proves identity; authorization, roles, ownership, rate limiting, Helmet, MFA, password reset, and immediate JWT revocation are intentionally out of scope.

The reusable implementation prompt is in [`SESSION_7_IMPLEMENTATION_PROMPT.md`](SESSION_7_IMPLEMENTATION_PROMPT.md).

## Stack and architecture

Node.js, Express 5, strict TypeScript with ESM/NodeNext, Prisma 7 with PostgreSQL, Zod, Argon2id, JWT HS256, opaque refresh tokens, Vitest, and Supertest.

- `routes` maps endpoints and applies middleware; `controllers` validate HTTP input and shape responses.
- `services` implement ticket and authentication workflows; `middleware` verifies tokens and handles errors.
- `lib` contains Prisma, password, JWT, and refresh-token primitives; `prisma` contains schema and non-destructive migrations.

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Create a separate database named `session_07_support_tickets_test`, set `TEST_DATABASE_URL`, and apply migrations to it before `npm test`. The test setup refuses to run against a database whose name does not contain `test` because it clears tables between cases:

```bash
DATABASE_URL="$TEST_DATABASE_URL" npx prisma migrate deploy
npm test
```

On PowerShell use `Copy-Item .env.example .env`. Generate a secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`. Use a separate disposable database for tests.

```bash
npm run typecheck
npm run build
npm test
npm start
```

## Authentication and security

Registration validates and normalizes email, hashes the password, and returns safe user data. Login returns a 15-minute access token and creates a seven-day refresh session. Refresh atomically consumes and rotates the cookie token while preserving original expiration. Reusing a consumed token revokes its family. Logout revokes only the current family and clears its cookie.

Argon2id uses `memoryCost=19456 KiB`, `timeCost=2`, and `parallelism=1`; human passwords need expensive guessing resistance. Refresh tokens contain 256 random bits, so fast SHA-256 safely enables lookup without storing the bearer secret.

JWTs contain `sub`, `iss`, `aud`, `iat`, `exp`, and `tokenType=access`. Verification restricts HS256 and validates identity claims. Tokens are never logged. The refresh cookie is HttpOnly, Secure in production, SameSite Strict, scoped to `/api/auth`, and capped by fixed session expiration. HttpOnly prevents direct JavaScript access but does not eliminate XSS. The design assumes same-site deployment; cross-site architecture needs deliberate CORS/CSRF/SameSite changes.

## Client behavior

Store the access token in memory and send `Authorization: Bearer <token>`. The browser manages the refresh cookie. After reload, call refresh to restore authentication. Coordinate refresh requests so only one runs at once. Failed refresh requires login. Logout must also clear the in-memory token. Issued access tokens may remain valid for 15 minutes; immediate revocation needs additional state.

## API

| Method | Path | Authentication | Success |
|---|---|---|---|
| POST | `/api/auth/register` | No | 201 safe user |
| POST | `/api/auth/login` | No | 200 user + access token + cookie |
| POST | `/api/auth/refresh` | Refresh cookie | 200 rotated cookie + access token |
| POST | `/api/auth/logout` | Optional refresh cookie | 204 |
| GET/POST | `/api/tickets` | Bearer token | 200/201 |
| GET/PATCH/DELETE | `/api/tickets/:id` | Bearer token | 200/200/204 |

Register with `{ "name": "Example User", "email": "user@example.com", "password": "ExampleStrongPassword123" }`. Ticket bodies and filters retain Session 6 behavior. Errors use `{ "error": { "message": "..." } }`: 400 validation, 401 authentication, 404 missing ticket, 409 duplicate email, and 500 unexpected errors.

## Postman

Import `postman/session-07-support-ticket-api.postman_collection.json`. Run Register, Login, then protected requests. Scripts capture `accessToken`; Postman manages cookies. To demonstrate reuse, copy the old cookie before refresh, refresh once, restore the old value in Cookie Manager, then refresh again. Test expiration only with isolated test configuration—never bypass security in the API.

## Data and limitations

`User` stores a normalized unique email and Argon2id hash. `RefreshToken` stores a unique SHA-256 hash, user, family, fixed expiration, consumption/revocation timestamps, and replacement link. History remains until post-expiration cleanup so reuse is detectable. Ticket UUIDs, fields, enums, defaults, validation, and CRUD behavior are unchanged.

This is an intermediate educational implementation, not a fully production-hardened API. Every authenticated user can access every ticket by design; authorization is a later lesson.
