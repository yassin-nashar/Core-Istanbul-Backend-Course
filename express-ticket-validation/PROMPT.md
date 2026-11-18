# Project Prompt and Commands

## Prompt

> Extend my existing `minimal-express-typescript` project.
>
> Requirements:
>
> 1. Keep `GET /health` and `GET /status` working.
> 2. Add `POST /api/tickets` with Zod validation:
>    - `title`: required non-empty string.
>    - `description`: required non-empty string.
>    - `priority`: `low`, `medium`, or `high`; defaults to `medium`.
> 3. For valid requests, return HTTP 201 with the validated ticket data.
> 4. For invalid requests, return HTTP 400 using `{ "error": { "message": "Invalid ticket data" } }`.
> 5. Add centralized Express error-handling middleware. Return a generic message for unexpected HTTP 500 errors.
> 6. Read `PORT` from environment configuration and validate it before startup.
> 7. Add `.env.example` and ensure `.env` is ignored by Git.
> 8. Keep this as a small learning exercise: no database, authentication, or full CRUD implementation yet.
>
> After making changes:
>
> - Run typecheck and build.
> - Start the server and test both existing endpoints.
> - Test valid and invalid POST requests.
> - Test an invalid PORT value.
> - Report actual command results and any remaining issues.

## Project continuation

Each exercise lives in a separate project. This project copies the preceding `express-logging-middleware` setup, preserves `GET /`, `GET /status`, and request logging, adds the requested `GET /health`, then implements ticket validation and centralized errors.

## Commands

```bash
npm install zod
npm run typecheck
npm run build
npm start
```

## Changes

- Added Zod as the only new dependency.
- Added `GET /health`, returning `{ "status": "ok" }`.
- Added JSON request parsing and `POST /api/tickets`.
- Added a Zod ticket schema that trims and requires non-empty `title` and `description`, restricts `priority`, and defaults it to `medium`.
- Added centralized error middleware for the specified HTTP 400 response and a generic HTTP 500 response.
- Added validated startup configuration for `PORT`; it defaults to `3000` and otherwise must be an integer from 1 through 65535.
- Added `.env.example` and added `.env` to `.gitignore`.
- Added no database, authentication, controllers, services, or CRUD layers.

## Actual verification results

Verified with Node.js `v22.19.0` and npm `10.9.3`:

- Dependency installation: 127 packages added, 128 audited, and 0 vulnerabilities found.
- `npm run typecheck`: passed with no TypeScript errors.
- `npm run build`: passed and generated `dist/server.js`.
- `npm start` with `PORT=3104`: started `node dist/server.js` successfully.
- `GET /`: HTTP 200 with `{"message":"Hello from Express 5 with TypeScript!"}`.
- `GET /health`: HTTP 200 with `{"status":"ok"}`.
- `GET /status`: HTTP 200 with `{"service":"running"}`.
- Valid `POST /api/tickets` without priority: HTTP 201 with `{"title":"Login issue","description":"User cannot sign in","priority":"medium"}`.
- Invalid `POST /api/tickets` with an empty title: HTTP 400 with `{"error":{"message":"Invalid ticket data"}}`.
- Middleware output logged all tested methods and paths, including both ticket requests.
- A malformed JSON request exercised the unexpected-error path: HTTP 500 with `{"error":{"message":"Internal server error"}}`.
- `npm start` with `PORT=not-a-port`: startup was rejected with `Invalid PORT: expected an integer between 1 and 65535.` and process exit code `1`.
- Temporary verification servers were stopped after the checks.

## Remaining issues

None for the requested scope. Persistence, authentication, and full CRUD behavior are intentionally not implemented.
