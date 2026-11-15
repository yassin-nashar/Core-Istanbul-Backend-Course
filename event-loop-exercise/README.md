# Session 2 — Exercise 1: Predict, Run & Verify

## Objective

Practice reasoning about Node.js execution order using synchronous code, Promise microtasks, and timer callbacks.

## Instructions

1. Open `index.mjs` without running it.
2. Predict the exact console output, including the order of every line.
3. Write down your prediction.
4. Run the project:

   ```bash
   npm start
   ```

5. Record the actual output and compare it with your prediction.
6. Identify any lines that appeared in a different position than you expected.

## Suggested AI Prompt

After you have made your prediction and run the project, ask an AI assistant:

> Explain why this Node.js program produced the output I observed. Walk through the synchronous code, Promise microtasks, and timer callbacks step by step. Also explain why each queued callback runs when it does.

Include the contents of `index.mjs`, your prediction, and the output you observed with your prompt.

## Deliverables

- Your predicted console output.
- The actual console output from `npm start`.
- A short explanation of the execution order and any differences from your prediction.
