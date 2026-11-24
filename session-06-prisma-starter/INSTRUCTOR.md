# Instructor Reference — Session 06 Prisma

This branch completes the schema and includes the initial PostgreSQL migration SQL. The Express API intentionally continues to use in-memory storage; Prisma-backed services belong to the next teaching block.

## What differs from `Session-6`

- `prisma/schema.prisma` contains the complete `Ticket` model and its enums.
- `prisma/migrations/20261124023000_init/migration.sql` contains the initial PostgreSQL migration.
- Prisma Client can be generated from the completed model.

The model uses a UUID-backed Prisma `String` ID. This preserves the current API contract, which exposes IDs as strings, so later database integration will not need to silently change response types.

## Verification performed while preparing this branch

The schema was formatted and validated with Prisma 7.10.1. Prisma Client 7.10.1 was generated successfully. The reference SQL was generated using Prisma's read-only schema diff:

```bash
npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script
```

This command does not connect to or modify a database.

No PostgreSQL username/password was supplied during preparation, so the migration was **not applied to a live database** and the table was **not claimed as database-verified**. Complete the dedicated-database steps below before class.

## Apply and verify against a dedicated training database

1. Create a disposable database named `session_06_instructor_training` in pgAdmin or your normal PostgreSQL administration tool.
2. Copy `.env.example` to `.env` and change only your local file so `DATABASE_URL` targets `session_06_instructor_training`.
3. Reconfirm that the URL does not point to an existing or important database.
4. Apply the committed migration:

```bash
npm run prisma:migrate
```

Expected result: Prisma reports the migration as applied and the database as in sync.

5. Generate Prisma Client and run project checks:

```bash
npm run prisma:generate
npm run typecheck
npm test
```

6. Inspect `prisma/migrations/20261124023000_init/migration.sql` and verify in pgAdmin:

- table `Ticket` exists in schema `public`;
- `id`, `title`, `description`, `status`, `priority`, and `createdAt` exist;
- `id` is the primary key;
- required fields are non-null;
- status defaults to `open`;
- priority defaults to `medium`;
- `createdAt` defaults to the current timestamp;
- enum values match the API contract.

You can also query PostgreSQL metadata:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'Ticket'
ORDER BY ordinal_position;
```

For enum values:

```sql
SELECT t.typname, e.enumlabel
FROM pg_type AS t
JOIN pg_enum AS e ON t.oid = e.enumtypid
WHERE t.typname IN ('TicketStatus', 'TicketPriority')
ORDER BY t.typname, e.enumsortorder;
```

## Safety note

Do not run `prisma migrate reset` against a database containing important data. If Prisma reports drift or proposes a reset, stop and verify the connection URL before taking action.

## 40-minute instructor checklist

- Before class: apply and verify the solution against the dedicated instructor database.
- 0–5 min: students verify connections and compare Prisma 7 config with the schema.
- 5–15 min: guide model and enum choices without displaying this branch.
- 15–23 min: create the `init` migration and inspect its SQL.
- 23–30 min: verify columns/defaults in pgAdmin.
- 30–35 min: generate Prisma Client and run checks.
- 35–40 min: review common errors and demonstrate the optional-field stretch migration.
