# Session 2 — Exercise 2: Refactor Callback Hell with AI

## Objective

Refactor a nested error-first callback workflow into Promise-based `async`/`await` code without changing its behavior.

## 1. Run the Original Version

```bash
npm start
```

Read `callback-version.mjs` and identify the success path, the error checks, and the point where each asynchronous operation begins.

## 2. Ask an AI Assistant for Help

Use this prompt as a starting point:

> Refactor the code in `callback-version.mjs` into Promise-based async/await code in `async-version.mjs`. Preserve the same operation order, console messages, success behavior, and failure behavior. The orders failure must stop the workflow before the email operation. Explain your changes, but do not add dependencies or unrelated features.

Review the AI response before using it. Make sure errors reject Promises and that one `try`/`catch` controls the workflow.

## 3. Implement and Test

Replace the TODO starter in `async-version.mjs` with your refactor, then run:

```bash
npm test
```

The starter fails both tests intentionally. Your refactor is complete when both the success and failure tests pass.

Run `npm start` again and compare the original callback behavior with the behavior required by the tests. Confirm that the operations stay in order and that sending the email is skipped after the orders error.

## Evidence to Report

- The AI prompt you used.
- Your completed `async-version.mjs`.
- The final `npm test` output.
- A short comparison of callback error handling and `async`/`await` error handling.
- One change you checked or corrected in the AI-generated refactor.
