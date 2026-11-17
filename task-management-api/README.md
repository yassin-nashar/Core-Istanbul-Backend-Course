# Task Management REST API

A small Express API for the Session 3 classroom activity on HTTP methods, headers, status codes, and response bodies.

## Requirements

- Node.js 18 or newer
- Postman

## Install and start

```bash
cd task-management-api
npm install
npm start
```

The API runs at `http://localhost:3000` by default.

## Use the Postman collection

1. Import `postman/Task-Management-API.postman_collection.json` into Postman.
2. Restart the server so the in-memory task list is empty.
3. Run the requests from top to bottom.
4. Inspect each request method and `Content-Type` header.
5. Compare the response status and body with `INSTRUCTOR-REFERENCE.md`.

The first four requests match the classroom exercise exactly:

1. `GET /tasks`
2. `POST /tasks (valid title)`
3. `POST /tasks (empty title)`
4. `GET /tasks/999999`

## Endpoints

| Method | Endpoint | Behavior |
| --- | --- | --- |
| GET | `/tasks` | Return all tasks |
| GET | `/tasks/:id` | Return one task |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/:id` | Update provided fields |
| DELETE | `/tasks/:id` | Delete a task |

`PUT` is intentionally not implemented in this project.

## Run the tests

```bash
npm test
```

Tasks are stored only in memory. Stop the server with `Ctrl+C` and run `npm start` again to reset the list and restart IDs from `1`.
