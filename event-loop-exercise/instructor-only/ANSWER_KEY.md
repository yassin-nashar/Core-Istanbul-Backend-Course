# Instructor Answer Key

This folder is for instructors only. Remove it before distributing the exercise to students.

## Expected Output

```text
1 - Start
6 - End
4 - Promise A
2 - Timer A
3 - Promise inside Timer
5 - Timer B
```

## Step-by-Step Execution Order

1. Node.js starts evaluating the top-level module synchronously, so the first log runs immediately.
2. Timer A is scheduled with a zero-millisecond delay. Its callback cannot run until the current synchronous work and the current microtask queue are complete.
3. Promise A schedules its `.then()` callback in the microtask queue.
4. The final top-level log runs immediately because module evaluation is still synchronous.
5. The top-level code is now complete, so Node.js drains the microtask queue. Promise A logs its message and schedules Timer B.
6. Node.js enters the timers phase. Timer A was registered before Timer B, so Timer A runs first and logs its message.
7. Timer A schedules a Promise callback as a microtask. After Timer A's callback finishes, Node.js drains the microtask queue before moving to the next timer callback. The Promise inside Timer therefore logs next.
8. Node.js continues the timers phase and runs Timer B, which produces the final log.

## Why the Promise Inside a Timer Runs Before the Next Timer

Node.js runs the microtask queue after the current JavaScript callback completes. When Timer A schedules a resolved Promise callback, that callback enters the microtask queue. Node.js drains that queue before it continues with another timer callback, so the Promise callback runs before Timer B.

## Questions for Students

1. Which statements run during the initial synchronous evaluation, and how can you identify them?
2. When is Timer B registered, and how does that affect its position relative to Timer A?
3. What change would you predict if the Promise inside Timer A were replaced with another `setTimeout(..., 0)`?

## Common Misconceptions

- A zero-millisecond timer runs immediately. It does not; it runs only after the current work and eligible microtasks finish.
- Promise callbacks run synchronously because the Promise is already resolved. They do not; `.then()` callbacks are queued as microtasks.
- All timers finish before any microtasks run. In Node.js, microtasks are drained after each callback, including between timer callbacks.
- Timer B must run before Timer A because it is created by a Promise. Microtask priority controls when Timer B is registered, not when its timer callback outranks an already registered timer.
- The numeric labels indicate the output order. They are only labels in the source and do not control scheduling.
