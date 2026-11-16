import assert from 'node:assert/strict';
import { test } from 'node:test';

import { replaceTaskCorrectly } from '../instructor/corrected-put.js';

function currentTask() {
  return {
    id: 3,
    title: 'Learn REST',
    completed: false
  };
}

test('a complete valid PUT replaces the full task representation', () => {
  const original = currentTask();

  const result = replaceTaskCorrectly(original, 3, {
    title: 'Practice REST',
    completed: true
  });

  assert.equal(result.status, 200);
  assert.deepEqual(result.response, {
    id: 3,
    title: 'Practice REST',
    completed: true
  });
  assert.deepEqual(result.task, result.response);
  assert.notEqual(result.task, original);
});

test('a PUT missing title is rejected and cannot behave like PATCH', () => {
  const original = currentTask();
  const snapshot = structuredClone(original);

  const result = replaceTaskCorrectly(original, 3, { completed: true });

  assert.equal(result.status, 400);
  assert.deepEqual(result.response, {
    error: 'title and completed are required'
  });
  assert.equal(result.task, original);
  assert.deepEqual(original, snapshot);
});

test('a PUT missing completed is rejected without modifying the task', () => {
  const original = currentTask();
  const snapshot = structuredClone(original);

  const result = replaceTaskCorrectly(original, 3, {
    title: 'Practice REST'
  });

  assert.equal(result.status, 400);
  assert.equal(result.task, original);
  assert.deepEqual(original, snapshot);
});

test('wrong field types are rejected without modifying the task', async (t) => {
  const invalidBodies = [
    { title: '', completed: true },
    { title: '   ', completed: true },
    { title: 42, completed: true },
    { title: 'Practice REST', completed: 'yes' }
  ];

  for (const body of invalidBodies) {
    await t.test(JSON.stringify(body), () => {
      const original = currentTask();
      const snapshot = structuredClone(original);

      const result = replaceTaskCorrectly(original, 3, body);

      assert.equal(result.status, 400);
      assert.equal(result.task, original);
      assert.deepEqual(original, snapshot);
    });
  }
});
