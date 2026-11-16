# PUT Handler Training Demo

This small Session 3 exercise contains an intentionally flawed `PUT` handler. Your task is to inspect the code, run the request sequence, and explain why the task loses visible data.

> **INTENTIONALLY BUGGY — FOR TRAINING ONLY**
>
> Do not copy this PUT implementation into a real API.

## Requirements

- Node.js 18 or newer
- No package installation is required

## Run the demo

From the course repository root:

```bash
cd put-handler-training
npm start
```

The server starts at `http://localhost:3000`.

## Send the requests

Keep the server running and execute the three requests in [`requests.http`](./requests.http) in order:

1. `GET /tasks/3` before the update
2. `PUT /tasks/3` with only `{ "completed": true }`
3. `GET /tasks/3` after the update

You can also use these exact curl commands from a second terminal:

```bash
curl http://localhost:3000/tasks/3

curl -X PUT http://localhost:3000/tasks/3 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

curl http://localhost:3000/tasks/3
```

On PowerShell, use:

```powershell
Invoke-RestMethod http://localhost:3000/tasks/3

Invoke-RestMethod http://localhost:3000/tasks/3 `
  -Method Put `
  -ContentType 'application/json' `
  -Body '{"completed":true}'

Invoke-RestMethod http://localhost:3000/tasks/3
```

## What to inspect

Open `src/server.js` and find the block labeled **INTENTIONALLY BUGGY — FOR TRAINING ONLY**.

When the request body omits `title`, reading `body.title` produces `undefined`. The new in-memory object still has a `title` property, but its value is `undefined`. `JSON.stringify` omits object properties whose values are `undefined`, so the API response can make the property look as though it disappeared completely.

Discuss:

- Is this handler replacing the complete task representation safely?
- What contract should a PUT endpoint enforce?
- What should happen to the stored task when the request is incomplete?

## Run the tests

```bash
npm test
```

## Reset the task

The data exists only in memory. Stop the server with `Ctrl+C`, then run `npm start` again to restore:

```json
{
  "id": 3,
  "title": "Learn REST",
  "completed": false
}
```
