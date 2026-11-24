# Session 06 — Prisma Starter

This classroom project keeps the Support Ticket API from the previous session in memory while preparing Prisma ORM for a PostgreSQL exercise. During class, students will define the database model and create their first migration. Database integration comes in the next teaching block.

## Prerequisites

- Node.js 22 or newer
- npm
- PostgreSQL running locally
- pgAdmin or another PostgreSQL client (recommended for inspection)

The project uses Prisma 7.10.1. Use the committed lockfile so everyone gets compatible packages.

## Installation

```bash
cd session-06-prisma-starter
npm install
cp .env.example .env
```

On PowerShell, copy the environment file with:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and replace `YOUR_PASSWORD`. Never commit `.env`.

## Create the training database

Create a new database named `session_06_training` in pgAdmin, or run this command from a PostgreSQL account allowed to create databases:

```sql
CREATE DATABASE session_06_training;
```

Use a dedicated training database. Do not point this exercise at a database containing important data.

## Run the API

```bash
npm run dev
```

The default URL is `http://localhost:3000`.

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok" }
```

Useful checks:

```bash
npm test
npm run typecheck
```

## Ticket API

Tickets are stored in memory and reset whenever the server restarts.

| Method | Endpoint | Success | Errors |
| --- | --- | --- | --- |
| GET | `/api/tickets` | 200 | — |
| GET | `/api/tickets/:id` | 200 | 400, 404 |
| POST | `/api/tickets` | 201 | 400 |
| PATCH | `/api/tickets/:id` | 200 | 400, 404 |
| DELETE | `/api/tickets/:id` | 204, no body | 400, 404 |

Example create request:

```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"Cannot sign in","description":"The login form rejects my password","priority":"high"}'
```

Example response:

```json
{
  "id": "server-generated-uuid",
  "title": "Cannot sign in",
  "description": "The login form rejects my password",
  "status": "open",
  "priority": "high",
  "createdAt": "server-generated-iso-timestamp"
}
```

Errors use one shape:

```json
{
  "error": {
    "message": "Ticket not found"
  }
}
```

More requests are available in `http/tickets.http` and the Postman collection under `postman/`.

## Prisma commands

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:studio
```

Prisma 7 reads the connection URL from `prisma.config.ts`. That file loads your local `.env`; the URL is intentionally not stored in `schema.prisma`.

The student schema intentionally has no `Ticket` model and no migration. Follow [EXERCISE.md](EXERCISE.md) to add them.

## Student and instructor branches

```bash
git switch Session-6
git switch instructor-solution
```

- `Session-6` is the student starter: TODO schema and no migration.
- `instructor-solution` is the instructor reference: completed schema, migration SQL, and verification notes.

Commit or stash your exercise work before switching branches.

## Troubleshooting

### Prisma cannot read `DATABASE_URL`

Confirm `.env` exists beside `package.json`, the variable is spelled exactly `DATABASE_URL`, and the password placeholder was replaced.

### Authentication failed

Check the PostgreSQL username/password in `.env`. A browser login or Windows password is not automatically your PostgreSQL password.

### Connection refused on port 5432

Start the PostgreSQL service and confirm its configured port. If your installation uses another port, update only your local `.env`.

### Database does not exist

Create `session_06_training` first and confirm the database name in `.env` matches it.

### Prisma commands use an unexpected version

Run commands through the npm scripts or `npx prisma`; do not use an unrelated global Prisma installation.

### Port 3000 is already in use

Choose another port in `.env`, for example `PORT=3001`, and restart the server.

## Suggested 40-minute class flow

- 0–5 min: verify PostgreSQL and review the starter schema.
- 5–15 min: define the `Ticket` model.
- 15–23 min: create and inspect the initial migration.
- 23–30 min: verify the table in pgAdmin/PostgreSQL.
- 30–35 min: generate Prisma Client and run checks.
- 35–40 min: troubleshooting and stretch-goal introduction.
