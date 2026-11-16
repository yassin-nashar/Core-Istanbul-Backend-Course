# Session 2 — Exercise 2: Reference Solution

This project contains the completed Promise-based `async`/`await` refactor. Share it only after students finish the starter exercise.

## Compare the Implementations

Run the original nested-callback workflow:

```bash
npm start
```

Read `callback-version.mjs`, then compare it with `async-version.mjs`. Both preserve the same operation order and short-circuit behavior.

## Verify the Solution

```bash
npm test
```

The tests verify both scenarios: all operations finish in order on success, while an orders failure stops execution before the email operation.

## Error-Handling Behavior

The callback version checks the error argument at every nesting level and returns early on failure. The Promise version rejects failed operations; `await` turns the rejection into a thrown error and transfers control to the shared `catch` block. If `getOrders` rejects, `sendEmail` is never called.
