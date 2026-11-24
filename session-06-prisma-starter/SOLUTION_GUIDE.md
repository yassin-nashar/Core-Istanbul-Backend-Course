# Solution Guide — From Memory to Prisma

## What changed

The service now calls a shared Prisma Client backed by the PostgreSQL driver adapter. `findMany`, `findUnique`, `create`, `update`, and `delete` replace the in-memory `Map`. Controllers remain responsible for HTTP parsing and responses; services remain responsible for database operations.

## Shared client and migrations

`src/lib/prisma.ts` creates one `pg.Pool`, one `PrismaPg` adapter, and one `PrismaClient`. Reusing this client avoids opening a new connection for every request. Shutdown handlers close the HTTP server, Prisma client, and pool. The model in `prisma/schema.prisma` is the source of truth; `prisma migrate dev` writes and applies SQL migrations, while `prisma generate` creates the type-safe client.

## Before and after

Before, create generated a UUID and stored an object in a `Map`. Now it is:

```ts
return prisma.ticket.create({ data: input });
```

The API response is unchanged because Prisma's `String` UUID ID and `DateTime` map directly to the existing contract.

## Missing records and filtering

Zod validates params, query filters, and bodies before the service runs. `findUnique` returning `null` and Prisma `P2025` update/delete errors both become 404. Filtering passes a Prisma `where` object to `findMany`; records are not filtered in JavaScript.

## Seed data

`npm run seed` upserts ten realistic tickets by title. It does not delete existing data and can be rerun safely.

## AI-assisted debugging

Use: **Read Error → Explain with AI → Propose Fix → Apply → Verify**. For `P1001`, check PostgreSQL host/port/database. For `P1000`, verify local credentials. For `P2025`, confirm the missing ID and expected 404. Always review, test, and verify AI-generated code; a plausible answer is not evidence that a migration is safe.

## Why no Repository Layer?

This exercise focuses on the Prisma boundary. Keeping the service directly above Prisma makes the data flow visible and avoids abstractions students do not need yet.
