# Session 4

This branch contains the projects developed during Session 4 of the Core Istanbul Backend Course.

Each new project added to this branch should also be listed here with a short two-to-three-line description explaining its purpose and the main concepts it demonstrates.

## Projects

### minimal-express-typescript

A minimal Express 5 backend configured with strict TypeScript, NodeNext ESM, and tsx. It demonstrates separate development, type-checking, build, and production-style start commands around a single JSON endpoint.

### express-logging-middleware

An extension of the minimal Express TypeScript backend that adds inline request logging and a `/status` endpoint. It demonstrates middleware ordering while keeping the original root route and the one-file application structure.

### express-ticket-validation

A continuation of the logging project that adds health reporting, Zod-validated ticket creation, centralized error handling, and validated PORT configuration. It remains a one-file learning backend with no database, authentication, or CRUD layers.

### support-ticket-crud-api

A structured continuation that separates the Express app into routes, controllers, and an in-memory service while implementing full Support Ticket CRUD behavior. It demonstrates strict create/update validation, consistent errors, generated IDs and timestamps, and preserves the system endpoints and environment configuration.
