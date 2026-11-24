# Exercise — Your First Prisma Model and Migration

## Objective

Describe the existing Ticket data in Prisma, create a PostgreSQL migration, inspect the SQL, and verify the result. The Express API must remain in-memory during this exercise.

## Before you begin

Install dependencies, copy `.env.example` to `.env`, replace the password placeholder, and create the dedicated `session_06_training` database. Never use a database containing important data.

## 1. Verify the local PostgreSQL connection

Check that PostgreSQL is running and the `DATABASE_URL` in `.env` points to `session_06_training`.

```bash
npx prisma db pull
```

Expected result: Prisma connects successfully. Because the new database is empty, it may report that no tables could be found; the important result is that there is no authentication, connection, or missing-database error. Do not keep schema changes produced by introspection at this stage.

## 2. Define the `Ticket` model

Open `prisma/schema.prisma` and replace the TODO with a complete model representing the approved API fields:

- server-generated ID
- required title and description
- status with `open`, `in_progress`, and `resolved`
- priority with `low`, `medium`, and `high`
- server-generated creation time

Choose database types and defaults deliberately. Keep the public API ID as a string; database-to-API mapping will be discussed before database integration.

```bash
npx prisma format
npx prisma validate
```

Expected result: the schema is formatted and reported as valid.

## 3. Create and apply the initial migration

Confirm once more that `.env` targets only the training database, then run:

```bash
npm run prisma:migrate -- --name init
```

Expected result: Prisma creates a timestamped directory under `prisma/migrations`, applies its SQL, and reports that the database is in sync.

## 4. Inspect the generated SQL

Open the new `migration.sql` file inside `prisma/migrations/<timestamp>_init/`.

Expected result: the SQL creates the Ticket table and its columns, primary key, database defaults, and any enum types your design requires. Read the SQL; do not edit it after it has been applied.

## 5. Verify the table in PostgreSQL

Refresh the `session_06_training` database in pgAdmin and inspect Schemas → public → Tables. Alternatively, use your PostgreSQL client to inspect the table definition.

Expected result: the Ticket table exists with the same columns, nullability, types, primary key, and defaults described by the migration SQL.

If the table is not visible, verify that pgAdmin is connected to the same host, port, database, and schema as `DATABASE_URL`, then refresh the object tree.

## 6. Generate Prisma Client

```bash
npm run prisma:generate
```

Expected result: Prisma generates the client into `src/generated/prisma`. Generated files are ignored by Git and can be recreated.

## 7. Run TypeScript checks

```bash
npm run typecheck
npm test
```

Expected result: TypeScript reports no errors and all API tests pass. The API remains in-memory; creating a ticket through HTTP does not insert a database row yet.

## Must Have

- A valid Ticket model matching every approved field.
- An initial migration created and applied only to the training database.
- Migration SQL inspected and compared with the schema.
- Table and columns verified in PostgreSQL or pgAdmin.
- Prisma Client generated successfully.
- TypeScript checks and API tests passing.

## Stretch Goal

Add one optional Ticket field of your choice. Then create a second migration with a descriptive name, apply it to the training database, and inspect the new SQL.

Expected result: the second migration alters the existing table without recreating or deleting unrelated data. Explain why an optional field is safer for existing rows than a new required field without a default.

## Common errors

- **`P1000` authentication failed:** fix the PostgreSQL username/password in `.env`.
- **`P1001` cannot reach database:** start PostgreSQL and confirm host/port.
- **`P1003` database does not exist:** create `session_06_training` or correct the URL.
- **Environment variable missing:** ensure the file is named exactly `.env` and lives beside `package.json`.
- **Schema validation error:** read the line number, check field syntax and default compatibility, then rerun `npx prisma format` and `npx prisma validate`.
- **Migration drift warning:** stop and ask the instructor before resetting anything; never reset an important database.
- **Generated client is stale:** rerun `npm run prisma:generate` after changing the schema.
