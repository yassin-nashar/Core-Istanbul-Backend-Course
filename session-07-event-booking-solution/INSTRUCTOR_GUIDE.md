# Instructor Guide

Suggested timing: inspect 5m, reproduce 10m, fix with AI 20m, test/review 10m.

| Category | Audit weakness (file/endpoint) | Secure behavior and fix | Verification |
|---|---|---|---|
| Authentication | `src/routes/user.routes.ts`, `GET /api/users/me` lacks authentication | Add `authenticate`; return 401 | Call without token |
| RBAC | `src/routes/event.routes.ts`, event mutations allow any authenticated user | Add `authorizeRoles("ADMIN")`; USER gets 403 | POST as USER/ADMIN |
| Ownership | `booking.service.ts` does not scope queries and accepts requested user ID | Derive owner from `req.user`; include `userId` in USER queries; cross-user 404 | Create with foreign userId, then cross-read |
| JWT | `lib/access-token.ts` decodes without verifying signature/claims | `jwt.verify`, HS256, issuer/audience/exp/type/sub checks | Modify token; expect 401 |
| Sensitive data | audit profile returns complete User | Explicit safe `select`; never password/refresh hashes | Inspect profile JSON |
| Headers | audit `app.ts` has no Helmet | Apply `helmet()` before routes | Check `X-Content-Type-Options` |
| Rate limiting | audit has no request limits | General limit plus stricter auth limit; consistent 429 JSON | Exceed configured test limit |

Both versions share endpoints, schema, business rules, refresh-token architecture, duplicate-booking constraint, and 409 event deletion policy. The audit version is deliberately localhost-only and rejects production startup.
