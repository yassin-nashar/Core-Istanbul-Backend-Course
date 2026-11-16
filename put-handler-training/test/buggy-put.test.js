import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';

import { createServer, getTask, resetTask } from '../src/server.js';

let server;
let baseUrl;

before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

beforeEach(() => {
  resetTask();
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('GET /tasks/3 returns the seeded task', async () => {
  const response = await fetch(`${baseUrl}/tasks/3`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    id: 3,
    title: 'Learn REST',
    completed: false
  });
});

test('buggy PUT stores a missing title as undefined and JSON omits it', async () => {
  const response = await fetch(`${baseUrl}/tasks/3`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ completed: true })
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { id: 3, completed: true });
  assert.equal(getTask().title, undefined);
  assert.equal(Object.hasOwn(getTask(), 'title'), true);
});

test('GET after the buggy PUT omits the undefined title', async () => {
  await fetch(`${baseUrl}/tasks/3`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ completed: true })
  });

  const response = await fetch(`${baseUrl}/tasks/3`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { id: 3, completed: true });
});

test('malformed JSON receives 400 without changing the task', async () => {
  const response = await fetch(`${baseUrl}/tasks/3`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: '{'
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Invalid JSON' });
  assert.deepEqual(getTask(), {
    id: 3,
    title: 'Learn REST',
    completed: false
  });
});

test('unknown routes receive 404', async () => {
  const response = await fetch(`${baseUrl}/tasks/99`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'Not Found' });
});

test('unsupported methods on /tasks/3 receive 405', async () => {
  const response = await fetch(`${baseUrl}/tasks/3`, { method: 'POST' });

  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET, PUT');
  assert.deepEqual(await response.json(), { error: 'Method Not Allowed' });
});
