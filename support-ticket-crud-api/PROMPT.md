# Project Prompt, Structure, and Verification

## Prompt

> Extend the existing `minimal-express-typescript` project into a structured Support Ticket CRUD API using Express 5, TypeScript, and Zod.
>
> **Requirements**
>
> 1. Refactor the application into `src/app.ts` and `src/server.ts`, with separate Routes, Controllers, and Services.
> 2. Keep the existing `GET /health` and `GET /status` endpoints working.
> 3. Define a Ticket with these fields:
>    - `id`: server-generated unique identifier
>    - `title`: required non-empty string
>    - `description`: required non-empty string
>    - `status`: `open | in_progress | resolved`, default `open`
>    - `priority`: `low | medium | high`, default `medium`
>    - `createdAt`: server-generated timestamp
> 4. Use in-memory storage. Do not add a database or repository layer.
> 5. Implement these endpoints:
>    - `GET /api/tickets` — list tickets
>    - `GET /api/tickets/:id` — get one ticket
>    - `POST /api/tickets` — create a ticket
>    - `PATCH /api/tickets/:id` — update selected fields
>    - `DELETE /api/tickets/:id` — delete a ticket
> 6. Validate create and update requests using Zod. Do not allow clients to set `id` or `createdAt`. Ensure PATCH does not reset omitted fields to defaults.
> 7. Use centralized error handling with consistent JSON error responses: `{ "error": { "message": "..." } }`
> 8. Return appropriate HTTP status codes: 200 for reads and updates, 201 for creation, 204 for deletion, 400 for invalid data, 404 for missing tickets, and 500 for unexpected errors.
> 9. Preserve environment configuration, secret hygiene, TypeScript strict mode, and existing npm scripts.
>
> **Verification**
>
> - Run the project's typecheck and build commands.
> - Start the API and test every CRUD endpoint.
> - Test invalid inputs and missing ticket IDs.
> - Confirm `/health` and `/status` still work.
> - Explain each file added or modified.
> - Report actual test results and unresolved issues. Do not claim any test passed unless you ran it.

## Project continuation

Each exercise lives in a separate directory. This project copies the preceding project's dependencies and configuration, preserves the root, health, status, logging, environment validation, and centralized error behavior, then refactors the application into the requested layered CRUD structure.

## Commands

```bash
npm ci
npm run typecheck
npm run build
npm start
```

## Files added or modified

- `.env.example`: Documents the supported `PORT` environment variable.
- `.gitignore`: Keeps `.env`, installed dependencies, and build output out of Git.
- `package.json`: Preserves the existing scripts and Express/Zod dependencies under the new project name.
- `package-lock.json`: Locks the exact dependency graph for repeatable installation.
- `tsconfig.json`: Preserves strict TypeScript and NodeNext ESM compilation.
- `src/app.ts`: Creates the Express app and registers logging, JSON parsing, routers, and centralized errors in order.
- `src/server.ts`: Starts the composed app using validated environment configuration.
- `src/config/env.ts`: Reads `PORT`, defaults it to `3000`, and rejects non-integer or out-of-range values before startup.
- `src/types/ticket.ts`: Defines the Ticket, status, and priority TypeScript types.
- `src/schemas/ticket.schema.ts`: Defines strict create and partial update Zod schemas. Only the create schema applies defaults.
- `src/errors/app-error.ts`: Represents expected HTTP errors such as missing tickets.
- `src/services/ticket.service.ts`: Owns the in-memory `Map` and all list, read, create, update, and delete operations.
- `src/controllers/system.controller.ts`: Implements the root, health, and status responses.
- `src/controllers/ticket.controller.ts`: Validates HTTP input, calls the ticket service, and selects success or not-found status codes.
- `src/routes/system.routes.ts`: Maps `/`, `/health`, and `/status` to system controllers.
- `src/routes/ticket.routes.ts`: Maps all five ticket CRUD endpoints to ticket controllers.
- `src/middleware/logging.middleware.ts`: Logs each request's method and path before routing.
- `src/middleware/error.middleware.ts`: Converts validation, expected, and unexpected errors into consistent JSON responses.
- `PROMPT.md`: Stores this prompt, file guide, commands, and observed verification results.
- Root `README.md`: Adds a short description of this project to the Session 4 project index.

## Actual verification results

Verified with Node.js `v22.19.0` and npm `10.9.3`:

- `npm ci`: installed 127 packages, audited 128 packages, and found 0 vulnerabilities.
- The first `npm run typecheck` correctly exposed three strict Express 5 param-type errors (`string | string[]`). Typing the three `:id` handlers as `RequestHandler<{ id: string }>` fixed the root cause.
- Final `npm run typecheck`: passed with no TypeScript errors.
- Final `npm run build`: passed and generated the structured NodeNext output under `dist`.
- `npm start` with `PORT=3106`: started `node dist/server.js` successfully.
- `GET /`: HTTP 200 with `{"message":"Hello from Express 5 with TypeScript!"}`.
- `GET /health`: HTTP 200 with `{"status":"ok"}`.
- `GET /status`: HTTP 200 with `{"service":"running"}`.
- Initial `GET /api/tickets`: HTTP 200 with `[]`.
- `POST /api/tickets`: HTTP 201 with a generated UUID, ISO timestamp, `status: "open"`, and `priority: "medium"`.
- `GET /api/tickets` after creation: HTTP 200 with the created ticket in the list.
- `GET /api/tickets/:id`: HTTP 200 with the created ticket.
- `PATCH /api/tickets/:id`: HTTP 200; updated only title and status while preserving description, priority, ID, and timestamp.
- Empty-title create input: HTTP 400 with `{"error":{"message":"Invalid ticket data"}}`.
- Create input containing client-provided `id`: HTTP 400 with the same consistent validation error.
- Empty PATCH body: HTTP 400.
- PATCH containing client-provided `createdAt`: HTTP 400.
- Invalid `priority: "urgent"`: HTTP 400.
- Invalid `status: "closed"`: HTTP 400.
- Missing ticket GET, PATCH, and DELETE: each returned HTTP 404 with `{"error":{"message":"Ticket not found"}}`.
- `DELETE /api/tickets/:id`: HTTP 204 with a zero-length response body.
- GET after deletion: HTTP 404; final ticket list returned HTTP 200 with `[]`.
- Malformed JSON exercised the unexpected-error path: HTTP 500 with `{"error":{"message":"Internal server error"}}`.
- Middleware output logged every tested method and path; server stderr was empty during the main CRUD run.
- `npm start` with `PORT=70000`: startup was rejected with the expected message and process exit code `1`.
- Temporary verification servers were stopped after testing.

## Unresolved issues

None within the requested scope. In-memory tickets intentionally disappear whenever the process restarts; persistence and a repository layer were explicitly excluded.
