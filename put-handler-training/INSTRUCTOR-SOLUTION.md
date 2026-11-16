# Instructor Solution — Safe PUT Replacement

## Root cause

The training handler constructs a replacement object from direct property reads:

```js
const updated = {
  id,
  title: body.title,
  completed: body.completed
};
```

For `{ "completed": true }`, `body.title` evaluates to `undefined`. The handler stores that value without validation. The property exists in memory, but `JSON.stringify` omits object properties whose value is `undefined`, so both the PUT response and the following GET serialize as:

```json
{
  "id": 3,
  "completed": true
}
```

## Why PUT replacement semantics matter

In this exercise, PUT means replacing the complete task representation at the target URI. A client must therefore provide every required replaceable field. An incomplete representation should be rejected before state changes.

Using fallback or merge logic such as `{ ...currentTask, ...body }` would preserve the title, but it would make this endpoint behave like PATCH. That hides the contract error instead of enforcing complete replacement semantics.

## Corrected implementation

The runnable instructor implementation is in `instructor/corrected-put.js`:

```js
export function replaceTaskCorrectly(currentTask, id, body) {
  const hasValidTitle = typeof body?.title === 'string'
    && body.title.trim().length > 0;
  const hasValidCompleted = typeof body?.completed === 'boolean';

  if (!hasValidTitle || !hasValidCompleted) {
    return {
      status: 400,
      response: { error: 'title and completed are required' },
      task: currentTask
    };
  }

  const task = {
    id,
    title: body.title,
    completed: body.completed
  };

  return { status: 200, response: task, task };
}
```

Validation happens before construction or assignment. A rejected request returns the original task object unchanged.

## Expected statuses and responses

### Complete valid PUT

Request:

```json
{
  "title": "Practice REST",
  "completed": true
}
```

Status: `200 OK`

```json
{
  "id": 3,
  "title": "Practice REST",
  "completed": true
}
```

### Missing title or completed

Status: `400 Bad Request`

```json
{
  "error": "title and completed are required"
}
```

The stored task remains unchanged. Wrong field types and a blank title receive the same response.

### Demo server route errors

- An unknown route returns `404 Not Found` with `{ "error": "Not Found" }`.
- An unsupported method on `/tasks/3` returns `405 Method Not Allowed`, an `Allow: GET, PUT` header, and `{ "error": "Method Not Allowed" }`.
- Malformed JSON returns `400 Bad Request` with `{ "error": "Invalid JSON" }`.

## Verify the corrected behavior

From `put-handler-training/`:

```bash
node --test test/corrected-put.test.js
```

The tests confirm that:

1. A complete valid representation succeeds.
2. Missing `title` is rejected with `400`.
3. Rejection leaves the existing task unchanged.
4. An incomplete request is not merged and cannot behave like PATCH.

## Reset the in-memory task

For the running classroom server, stop it with `Ctrl+C` and run `npm start` again. During automated tests, import and call `resetTask()` from `src/server.js` before each case.
