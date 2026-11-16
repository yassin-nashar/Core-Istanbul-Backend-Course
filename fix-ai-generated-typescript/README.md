# Session 2 — Exercise 3: Fix AI-Generated TypeScript

## Objective

Use TypeScript Strict Mode, automated checks, and an AI assistant to diagnose and safely fix deliberately incorrect TypeScript code.

## Setup

```bash
npm install
```

## Workflow

1. Run the initial type check:

   ```bash
   npm run typecheck
   ```

2. Identify the three reported type errors before changing the code.
3. Ask an AI assistant to propose a safe fix, then review its answer.
4. Keep `strict` enabled and do not introduce explicit `any`.
5. Export `getTaskTitle` so the tests can verify it.
6. Make invalid input throw an error instead of silently returning a value.
7. Verify the completed solution:

   ```bash
   npm run typecheck
   npm run build
   npm test
   npm start
   ```

The application should print the expected task title after a successful build. The tests also pass an invalid value to confirm it is handled safely.

## Suggested AI Prompt

> Review `src/app.ts` and the TypeScript errors from `npm run typecheck`. Fix all errors without using `any` and without disabling Strict Mode. Keep `getTaskTitle` accepting `unknown`, export it for testing, and make invalid input throw an error. Explain every change and do not add unrelated features.

## Deliverables

- The three original TypeScript errors in your own words.
- The AI prompt and response you used.
- Your corrected `src/app.ts`.
- Successful output from `typecheck`, `build`, `test`, and `start`.
- The invalid input you tested and the observed safe behavior.
- A short explanation of what the AI changed, what you verified, and why the final code is type-safe.
