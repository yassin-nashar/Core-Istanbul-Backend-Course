# Project Prompt and Commands

## Prompt

> In my existing `minimal-express-typescript` project:
>
> 1. Keep the existing `GET /health` endpoint unchanged.
> 2. Add a new `GET /status` endpoint that returns `{ "service": "running" }`.
> 3. Add a Logging Middleware before both routes.
> 4. The middleware should log the HTTP method and request path, then call `next()`.
> 5. Keep the project minimal. Do not add new folders, controllers, services, databases, or unnecessary dependencies.
> 6. Explain the changes you made.
>
> After implementation, run the available typecheck and build scripts, start the server, and verify both endpoints.
>
> Report the actual results of every verification step. Do not claim success unless the commands were executed.

## Clarification

The source project contains `GET /`, not `GET /health`. As requested in the follow-up, this project preserves `GET /` unchanged and adds the remaining behavior around `/` and `/status`.

## Commands

```bash
npm ci
npm run typecheck
npm run build
npm start
```

## Changes

- Copied the minimal Express TypeScript project into this new project without `node_modules` or `dist`.
- Kept the existing `GET /` handler and response unchanged.
- Registered one inline logging middleware before both routes. It logs the request method and path, then calls `next()`.
- Added `GET /status`, which returns `{ "service": "running" }`.
- Added no application folders, controllers, services, databases, or dependencies.

## Verification

Verified with Node.js `v22.19.0` and npm `10.9.3`:

- `npm ci` completed successfully: 126 packages installed, 127 packages audited, and 0 vulnerabilities found.
- `npm run typecheck` completed successfully with no TypeScript errors.
- `npm run build` completed successfully and generated `dist/server.js`.
- `npm start` launched `node dist/server.js` on test port `3103`.
- `GET /` returned `{"message":"Hello from Express 5 with TypeScript!"}`.
- `GET /status` returned `{"service":"running"}`.
- Server output included both middleware log lines: `GET /` and `GET /status`.
- Server stderr was empty during endpoint verification.

The temporary verification server was stopped after both responses and log lines were captured.
