# Instructor Reference

Do not distribute this directory until students finish the exercise.

## The Three Errors

1. `id` is declared as a `number` in `Task`, but the starter assigns the string `"101"`.
2. `completed` is declared as a `boolean`, but the starter assigns the string `"false"`.
3. `value` has the safe type `unknown`, so TypeScript does not allow direct access to `value.title` until runtime checks narrow it to a task-shaped object.

## Reference Approach

`solution.ts` corrects the two property values and uses a type guard to validate unknown input before reading its title. Invalid input throws a `TypeError`. This is one valid solution; students may use another implementation that satisfies the same behavioral and type-safety contract.

## Expected Results

The untouched starter produces three TypeScript errors during `npm run typecheck`. The build command also fails and `noEmitOnError` prevents it from generating runnable JavaScript until students fix those errors.

The reference solution:

- passes strict type checking;
- compiles successfully;
- passes all four automated tests;
- prints `Review API` at runtime;
- throws for invalid input;
- contains no explicit `any`.

## Unsafe AI Fixes to Reject

- Replacing `unknown` with `any`.
- Using `value as Task` without validating the runtime value.
- Disabling `strict`, `strictNullChecks`, or `noImplicitAny`.
- Adding `// @ts-ignore` or `// @ts-nocheck`.
- Returning `value.title` through optional chaining without reporting invalid input.
- Changing the interface to accept incorrect string values instead of correcting the data.

## Instructor Checklist

- [ ] Students record all three initial errors before editing.
- [ ] Strict Mode remains enabled.
- [ ] No explicit `any` or TypeScript suppression comments are added.
- [ ] Valid task data returns `Review API`.
- [ ] Invalid input is rejected safely.
- [ ] Typecheck, build, tests, and runtime all succeed after the fix.
- [ ] Students can explain which AI suggestions they accepted or rejected.
