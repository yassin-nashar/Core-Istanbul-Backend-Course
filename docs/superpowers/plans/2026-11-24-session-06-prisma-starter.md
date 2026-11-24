# Session 06 Prisma Starter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a student Prisma/PostgreSQL starter project on `Session-6` plus a reference implementation on `instructor-solution` while preserving the in-memory Ticket API contract.

**Architecture:** The repository contains one project folder, `session-06-prisma-starter`, organized as Routes → Controllers → Services with in-memory persistence and centralized error handling. Prisma is configured but intentionally model-free on the student branch; the instructor branch adds only the completed model, generated migration SQL, and verification notes while leaving runtime persistence unchanged.

**Tech Stack:** Node.js 22, npm, TypeScript strict NodeNext/ESM, Express 5, Zod, current compatible Prisma packages, PostgreSQL, Vitest, Supertest

**Spec:** `docs/superpowers/specs/2026-11-24-session-06-prisma-starter-design.md`

## Global Constraints

- Project directory is exactly `session-06-prisma-starter/`.
- Student branch is `Session-6`; solution branch is `instructor-solution`.
- Do not use Docker.
- Use the npm-installed Prisma version's actual configuration requirements.
- Keep the API on in-memory storage and preserve all approved endpoints, response codes, and error envelope.
- Student branch contains no `Ticket` Prisma model and no migration.
- Never commit `.env`, credentials, or a real connection string.
- No repository pattern, onion architecture, authentication, Firebase, Supabase, deployment claims, or unnecessary libraries.

## Review Focus

- Whitespace-only title/description must return 400; Task 2 tests both create and patch validation.
- An empty PATCH body must return 400 instead of silently succeeding; Task 2 pins this behavior.
- Invalid/missing ticket IDs must use the centralized error envelope; Task 2 tests 400 and 404 separately.
- DELETE success must return 204 with a truly empty response body; Task 2 asserts `response.text === ""`.
- Prisma commands on the student schema must not accidentally require or reveal the completed model; Task 3 checks schema formatting/config and scans tracked content.

---

### Task 1: Project Toolchain and Health Endpoint

**Files:**
- Create: `session-06-prisma-starter/package.json`
- Create: `session-06-prisma-starter/package-lock.json`
- Create: `session-06-prisma-starter/tsconfig.json`
- Create: `session-06-prisma-starter/.gitignore`
- Create: `session-06-prisma-starter/.env.example`
- Create: `session-06-prisma-starter/src/app.ts`
- Create: `session-06-prisma-starter/src/server.ts`
- Create: `session-06-prisma-starter/src/middleware/error.middleware.ts`
- Test: `session-06-prisma-starter/tests/health.test.ts`

**Interfaces:**
- Produces: `createApp(): Express` from `src/app.ts`; `AppError` and `errorHandler` from `src/middleware/error.middleware.ts`.

- [ ] **Step 1: Initialize npm metadata and install runtime/dev dependencies**

Run npm initialization inside the project, install Express 5 and Zod, then install TypeScript, tsx, Node/Express types, Vitest, and Supertest types as dev dependencies. Record the exact current compatible versions in the lockfile.

- [ ] **Step 2: Configure ESM and strict TypeScript**

Set `type: module`; define `dev`, `start`, `typecheck`, and `test` scripts; configure `module` and `moduleResolution` as `NodeNext`, strict mode, `rootDir`, `outDir`, and Node types.

- [ ] **Step 3: Write the failing health test**

Add `GET /health` assertions for status 200, JSON content type, and exact body `{ status: "ok" }` against `createApp()`.

- [ ] **Step 4: Run the health test and verify it fails**

Run: `npm test -- --run tests/health.test.ts`
Expected: FAIL because `src/app.ts` does not yet export a working app.

- [ ] **Step 5: Implement the minimal app, server, and centralized error types**

Implement `createApp(): Express`, JSON middleware, `/health`, a port-reading server entry point, `AppError(statusCode: number, message: string)`, and `errorHandler` returning `{ error: { message } }`.

- [ ] **Step 6: Run health test and type checking**

Run: `npm test -- --run tests/health.test.ts` and `npm run typecheck`
Expected: both exit 0.

- [ ] **Step 7: Commit the toolchain and health slice**

Commit message: `feat: scaffold session 6 starter`

### Task 2: In-memory Ticket CRUD Contract

**Files:**
- Create: `session-06-prisma-starter/src/types/ticket.ts`
- Create: `session-06-prisma-starter/src/schemas/ticket.schema.ts`
- Create: `session-06-prisma-starter/src/services/ticket.service.ts`
- Create: `session-06-prisma-starter/src/controllers/ticket.controller.ts`
- Create: `session-06-prisma-starter/src/routes/ticket.routes.ts`
- Modify: `session-06-prisma-starter/src/app.ts`
- Test: `session-06-prisma-starter/tests/tickets.test.ts`

**Interfaces:**
- Consumes: `createApp`, `AppError`, and `errorHandler` from Task 1.
- Produces: `Ticket`, `TicketStatus`, `TicketPriority`; create/update Zod schemas; `ticketRouter`; in-memory service CRUD functions and test reset hook.

- [ ] **Step 1: Write failing happy-path CRUD tests**

Test POST defaults/trimming and 201, GET list/detail 200, PATCH 200, DELETE 204 with empty text, and subsequent GET 404.

- [ ] **Step 2: Run happy-path tests and verify failure**

Run: `npm test -- --run tests/tickets.test.ts`
Expected: FAIL with `/api/tickets` missing.

- [ ] **Step 3: Define Ticket types and Zod input contracts**

Use string API IDs, ISO string `createdAt`, statuses `open | in_progress | resolved`, priorities `low | medium | high`, trimmed nonempty create strings, optional patch fields, and a refinement requiring at least one patch field.

- [ ] **Step 4: Implement in-memory service interfaces**

Implement `listTickets`, `getTicketById`, `createTicket`, `updateTicket`, `deleteTicket`, and `resetTickets`; generate server-side string IDs and timestamps; throw `AppError(404, ...)` for missing records.

- [ ] **Step 5: Implement controller and router interfaces**

Parse params/body with Zod, map validation errors to status 400 through centralized middleware, and send the exact approved status codes including bodyless 204.

- [ ] **Step 6: Run happy-path tests and verify pass**

Run: `npm test -- --run tests/tickets.test.ts`
Expected: happy-path tests pass.

- [ ] **Step 7: Add failing contract-edge tests**

Add assertions for whitespace-only title/description, invalid enum values, empty PATCH, invalid ID shape, missing IDs, exact error envelope, and unchanged defaults.

- [ ] **Step 8: Run edge tests, implement only required corrections, and rerun**

Run: `npm test -- --run tests/tickets.test.ts` and `npm run typecheck`
Expected: all tests and type checking pass.

- [ ] **Step 9: Commit the CRUD slice**

Commit message: `feat: add in-memory ticket api`

### Task 3: Student Prisma Preparation

**Files:**
- Modify: `session-06-prisma-starter/package.json`
- Modify: `session-06-prisma-starter/package-lock.json`
- Modify: `session-06-prisma-starter/.env.example`
- Create: `session-06-prisma-starter/prisma.config.ts`
- Create: `session-06-prisma-starter/prisma/schema.prisma`
- Test: `session-06-prisma-starter/tests/prisma-starter.test.ts`

**Interfaces:**
- Consumes: npm project from Task 1.
- Produces: installed Prisma CLI/client packages, version-correct config, PostgreSQL datasource/generator, and scripts `prisma:generate`, `prisma:migrate`, `prisma:studio` when supported.

- [ ] **Step 1: Install current compatible Prisma packages through npm**

Install Prisma CLI as a dev dependency plus the matching client and PostgreSQL adapter/runtime packages required by the installed version; record `npx prisma --version` output for the report.

- [ ] **Step 2: Inspect installed Prisma documentation/types and choose only that version's configuration pattern**

Confirm datasource URL placement, generator provider/output requirements, and whether a driver adapter is required at runtime; do not copy older-version conventions.

- [ ] **Step 3: Write failing starter-artifact tests**

Assert schema/config/example files exist, datasource provider is PostgreSQL, TODO guidance exists, no `model Ticket` exists, no `prisma/migrations` directory exists, and `.env` is ignored.

- [ ] **Step 4: Run the starter test and verify failure**

Run: `npm test -- --run tests/prisma-starter.test.ts`
Expected: FAIL until Prisma artifacts are created.

- [ ] **Step 5: Create the version-correct starter schema and config**

Configure PostgreSQL and the client generator using the installed version's required syntax. Add TODO comments that describe fields conceptually without giving the complete model solution.

- [ ] **Step 6: Add safe environment example and npm Prisma scripts**

Use a clearly named local training database URL example with placeholder credentials and document that `.env` must be copied locally and never committed.

- [ ] **Step 7: Run starter tests and safe Prisma checks**

Run the artifact test, `npx prisma format`, `npx prisma validate` if the model-free schema supports it, full tests, and type checking. Record any intentional limitation rather than adding the model.

- [ ] **Step 8: Commit student Prisma preparation**

Commit message: `feat: prepare prisma student exercise`

### Task 4: Student Documentation and HTTP Examples

**Files:**
- Create: `session-06-prisma-starter/README.md`
- Create: `session-06-prisma-starter/EXERCISE.md`
- Create: `session-06-prisma-starter/http/tickets.http`
- Create: `session-06-prisma-starter/postman/session-06-ticket-api.postman_collection.json`
- Test: `session-06-prisma-starter/tests/documentation.test.ts`

**Interfaces:**
- Consumes: exact scripts, endpoints, and Prisma configuration from Tasks 1–3.
- Produces: beginner setup guide, seven-step exercise, Must Have/Stretch Goal sections, troubleshooting, branch-switch instructions, and executable request examples.

- [ ] **Step 1: Write failing documentation contract tests**

Assert required files and headings, all endpoints/statuses, all seven exercise tasks, verification commands, expected results, troubleshooting, Must Have, Stretch Goal, and no complete `model Ticket` solution in student docs.

- [ ] **Step 2: Run documentation tests and verify failure**

Run: `npm test -- --run tests/documentation.test.ts`
Expected: FAIL because documentation is absent.

- [ ] **Step 3: Write README and EXERCISE instructions**

Document prerequisites, npm install, safe PostgreSQL database creation through the user's local tooling, `.env` setup, dev/typecheck/test/Prisma commands, API examples, branch switching, common Prisma/PostgreSQL errors, and the 40-minute exercise flow without revealing the model.

- [ ] **Step 4: Add HTTP and Postman examples**

Cover health and every Ticket CRUD endpoint with valid example payloads and environment-neutral localhost URLs.

- [ ] **Step 5: Run documentation and full student verification**

Run: `npm test -- --run`, `npm run typecheck`, dependency audit/reporting, and tracked-file secret checks.
Expected: tests/typecheck pass; audit findings, if any, are reported accurately.

- [ ] **Step 6: Start the real server and smoke-test health/CRUD**

Start through the npm development script, call `/health` and the complete CRUD sequence, stop the process, and record actual results.

- [ ] **Step 7: Commit and push the student branch**

Commit message: `docs: add prisma classroom exercise`; push `Session-6` to `origin` only after fresh verification.

### Task 5: Instructor Prisma Reference Solution

**Files:**
- Modify on `instructor-solution`: `session-06-prisma-starter/prisma/schema.prisma`
- Create on `instructor-solution`: `session-06-prisma-starter/prisma/migrations/<timestamp>_init/migration.sql`
- Create on `instructor-solution`: `session-06-prisma-starter/prisma/migrations/migration_lock.toml` when generated by installed Prisma
- Create on `instructor-solution`: `session-06-prisma-starter/INSTRUCTOR.md`
- Modify on `instructor-solution`: `session-06-prisma-starter/tests/prisma-starter.test.ts`

**Interfaces:**
- Consumes: verified `Session-6` head and its installed Prisma version.
- Produces: complete Prisma `Ticket` model, checked migration SQL, generated client, and exact instructor verification instructions.

- [ ] **Step 1: Create `instructor-solution` from the verified `Session-6` head**

Confirm branch ancestry and a clean working tree before changing solution artifacts.

- [ ] **Step 2: Replace student-only artifact assertions with failing solution assertions**

Require `model Ticket`, all approved fields, database defaults, an initial migration SQL file, and instructor verification documentation.

- [ ] **Step 3: Run the solution test and verify failure**

Run: `npm test -- --run tests/prisma-starter.test.ts`
Expected: FAIL because model and migration are absent.

- [ ] **Step 4: Implement the Ticket model**

Use a string-compatible generated ID, required title/description, enums or string mapping appropriate to the installed Prisma/PostgreSQL version, status default `open`, priority default `medium`, and generated `createdAt`; keep API types unchanged.

- [ ] **Step 5: Validate and generate Prisma Client**

Run: `npx prisma format`, `npx prisma validate`, and `npm run prisma:generate`
Expected: all exit 0 without exposing credentials.

- [ ] **Step 6: Create the initial migration safely**

If working credentials for a dedicated training database are available, run the npm migration script against only that database and inspect the generated SQL. Otherwise use the installed Prisma schema-diff command to generate reference SQL without applying it, clearly marking database application as unverified.

- [ ] **Step 7: Verify migration behavior when credentials permit**

Query PostgreSQL metadata through a temporary npm-based script/tool against the dedicated database to confirm table, columns, types, nullability, and defaults. Never target an existing important database.

- [ ] **Step 8: Write `INSTRUCTOR.md` with exact performed and remaining checks**

Include database creation target, migration/generation commands, SQL inspection, metadata verification, API-ID mapping note, reset caution, and an explicit distinction between executed and unexecuted checks.

- [ ] **Step 9: Run full solution verification**

Run full tests, type checking, Prisma validation/generation, server health/CRUD smoke test, `git diff Session-6...instructor-solution`, and secret scans.

- [ ] **Step 10: Commit and push the solution branch**

Commit message: `feat: add prisma instructor solution`; push `instructor-solution` to `origin` only after fresh verification.

### Task 6: Final Cross-branch Audit and Report

**Files:**
- Modify only if verification finds a defect; apply fixes first to the appropriate owning branch and propagate shared fixes deliberately.

**Interfaces:**
- Consumes: pushed student and instructor branches.
- Produces: evidence-backed final report with structure, commands, branch differences, performed checks, remaining database setup, and 40-minute instructor checklist.

- [ ] **Step 1: Verify remote branch refs and clean local state**

Fetch/inspect `origin/Session-6` and `origin/instructor-solution`, compare their commit IDs to local refs, and confirm no uncommitted files or credentials.

- [ ] **Step 2: Verify student branch exclusions**

Confirm the remote student tree has no complete Ticket model, no migrations, no `.env`, and no instructor-only solution document.

- [ ] **Step 3: Verify instructor branch additions and unchanged API**

Confirm the branch diff is limited to solution artifacts and the API tests remain identical/passing.

- [ ] **Step 4: Prepare the final report**

List project structure, exact student start/exercise commands, branch differences, actual test/check output, database verification limitations, and a concise 40-minute classroom checklist.
