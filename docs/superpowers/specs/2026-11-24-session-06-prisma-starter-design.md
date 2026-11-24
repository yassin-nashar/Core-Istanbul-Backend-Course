# Session 06 Prisma Starter — Design

## Intent

Create a beginner-friendly classroom project named `session-06-prisma-starter` for the course “Software Development using AI — Backend”. Students will start from the existing in-memory Support Ticket API, learn how Prisma is configured for PostgreSQL, define the database model themselves, create a migration, and inspect its generated SQL without integrating the database into the API yet.

## Goals

- Preserve the approved Ticket REST API contract and the Routes → Controllers → Services structure.
- Keep ticket persistence in memory for this teaching block.
- Use strict TypeScript, ESM/NodeNext, Express 5, Zod, PostgreSQL, and the current npm-installed compatible Prisma toolchain.
- Provide a student starter on `Session-6` with Prisma configured but no `Ticket` model and no migration.
- Provide an `instructor-solution` branch with the complete `Ticket` model and initial migration.
- Make setup, exercise steps, verification, troubleshooting, and classroom flow clear to beginners.
- Push both completed branches to `origin` after verification.

## Non-goals

- No Prisma-backed service implementation yet.
- No repository or onion architecture.
- No authentication, Firebase, Supabase, deployment guide, or unrelated libraries.
- No automatic migration of an existing or important database.

## Anti-goals

- Do not mix configuration or commands from incompatible Prisma versions.
- Do not expose credentials or commit `.env`.
- Do not change endpoint status codes, error shape, or the Ticket ID representation silently.
- Do not present an unverified database migration as successful.
- Do not reveal the full model solution in the student instructions or starter branch.

## Constraints

- Prisma is installed and invoked through npm; Docker will not be used.
- A PostgreSQL listener is available on `localhost:5432`, but credentials and a dedicated training database are not yet confirmed.
- Database work must target a new disposable/training database only.
- The repository currently has an empty root commit on `Session-6`.

## Approaches Considered

### 1. Current compatible Prisma through npm — selected

Install Prisma and its required client/adapter packages from npm, inspect the installed versions, and implement the configuration style required by those exact versions. This matches the exercise specification and avoids teaching obsolete Prisma configuration.

Tradeoff: current Prisma may require more explicit configuration than older tutorials, so the documentation must explain it carefully.

### 2. Pin an older Prisma release for simpler classroom setup — rejected

This could align with older course material, but it conflicts with the explicit requirement to use the current compatible installed version and risks teaching deprecated configuration.

## Student Branch Design (`Session-6`)

The project will live at repository root level as the folder `session-06-prisma-starter/`.

The Express app will include:

- `GET /health` returning `{ "status": "ok" }`.
- Ticket CRUD endpoints under `/api/tickets` with the approved status codes and centralized `{ "error": { "message": "..." } }` responses.
- Zod schemas for create, update, and route parameters.
- A simple in-memory service and readable controller/route separation.
- Automated API tests covering health, CRUD, validation, not-found responses, and the empty 204 delete response.

Prisma preparation will include:

- PostgreSQL datasource and the correct generator/config files for the installed Prisma version.
- `.env.example` containing only a safe local training URL placeholder/example.
- TODO comments where students define `Ticket`; no complete model and no migrations.
- npm scripts for development, type checking, tests, Prisma generation, migration development, and Studio when supported.

Documentation will include:

- `README.md` for prerequisites, install/setup, PostgreSQL database creation, environment setup, running the API, branch switching, expected responses, and troubleshooting.
- `EXERCISE.md` for the required classroom sequence, expected outcomes, commands, common errors, Must Have work, and the optional-field second-migration stretch goal.
- A small Postman collection plus copyable HTTP examples.

## Instructor Branch Design (`instructor-solution`)

The instructor branch will be created from the verified student branch, preserving the same starter project and adding only the reference solution artifacts:

- A complete Prisma `Ticket` model matching the API fields and defaults.
- An initial migration generated for PostgreSQL, committed with its SQL.
- Generated Prisma Client verification.
- Exact database and SQL/table verification instructions.

The API will remain in-memory. The database identifier will use a Prisma-compatible representation while the documentation will explicitly explain how it maps to the existing API string ID contract for the later integration block.

## Validation Strategy

For the student branch:

- Install dependencies.
- Run automated tests and TypeScript checking.
- Start the server and make a real request to `/health`.
- Exercise the Ticket CRUD contract.
- Run Prisma validation appropriate to the intentionally incomplete starter schema without supplying the model solution.
- Scan tracked files for `.env` and credential leakage.

For the instructor branch:

- Repeat tests and type checking.
- Validate the completed Prisma schema and generate Prisma Client.
- If dedicated PostgreSQL credentials are supplied, create/use only a clearly named training database, apply the initial migration through npm scripts, and query metadata to confirm the expected table/columns.
- If credentials are unavailable, generate/verify what can be checked without connecting and explicitly report database application as unverified.

## Remaining Builder Decisions

- Select the exact testing library only after checking compatibility with the installed Node.js and Express versions; prefer Node’s built-in test runner plus a minimal HTTP test helper when practical.
- Choose the Prisma-native ID type that best preserves a string API ID later, and document the mapping rather than changing the API now.
- Keep code and comments at an introductory course level.

## Open Input

- PostgreSQL username and password (or confirmation of passwordless local authentication) are required to create and verify a dedicated training database.
