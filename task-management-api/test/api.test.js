import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';

import app, { resetTasks } from '../src/server.js';

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

beforeEach(() => {
  resetTasks();
});

after(async () => {
  if (server) {
    server.closeAllConnections();
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

async function sendJson(path, method, body) {
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function createTask(title = 'Learn REST') {
  const response = await sendJson('/tasks', 'POST', { title });
  return response.json();
}

test('classroom: GET /tasks returns 200 with an array', async () => {
  const response = await fetch(`${baseUrl}/tasks`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), []);
});

test('classroom: POST /tasks with a valid title returns 201', async () => {
  const response = await sendJson('/tasks', 'POST', { title: 'Learn REST' });

  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    id: 1,
    title: 'Learn REST',
    completed: false
  });
});

test('classroom: POST /tasks with an empty title returns 400', async () => {
  const response = await sendJson('/tasks', 'POST', { title: '' });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Title is required' });
});

test('classroom: GET /tasks/999999 returns 404', async () => {
  const response = await fetch(`${baseUrl}/tasks/999999`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'Task not found' });
});

test('GET /tasks/:id returns an existing task', async () => {
  const task = await createTask();

  const response = await fetch(`${baseUrl}/tasks/${task.id}`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), task);
});

test('POST rejects missing, whitespace-only, and non-string titles', async (t) => {
  const invalidBodies = [{}, { title: '   ' }, { title: 42 }];

  for (const body of invalidBodies) {
    await t.test(JSON.stringify(body), async () => {
      const response = await sendJson('/tasks', 'POST', body);

      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), { error: 'Title is required' });
    });
  }

  const tasksResponse = await fetch(`${baseUrl}/tasks`);
  assert.deepEqual(await tasksResponse.json(), []);
});

test('PATCH updates only title and preserves completed', async () => {
  const task = await createTask();

  const response = await sendJson(`/tasks/${task.id}`, 'PATCH', {
    title: 'Practice REST'
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    id: 1,
    title: 'Practice REST',
    completed: false
  });
});

test('PATCH updates only completed and preserves title', async () => {
  const task = await createTask();

  const response = await sendJson(`/tasks/${task.id}`, 'PATCH', {
    completed: true
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    id: 1,
    title: 'Learn REST',
    completed: true
  });
});

test('PATCH validates all provided fields before changing the task', async () => {
  const task = await createTask();

  const response = await sendJson(`/tasks/${task.id}`, 'PATCH', {
    title: '',
    completed: true
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Title is required' });

  const unchanged = await fetch(`${baseUrl}/tasks/${task.id}`);
  assert.deepEqual(await unchanged.json(), task);
});

test('PATCH rejects a non-boolean completed value', async () => {
  const task = await createTask();

  const response = await sendJson(`/tasks/${task.id}`, 'PATCH', {
    completed: 'yes'
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'Completed must be a boolean'
  });
});

test('PATCH returns 404 for a missing task before validating the body', async () => {
  const response = await sendJson('/tasks/999999', 'PATCH', {
    title: ''
  });

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'Task not found' });
});

test('PATCH rejects a non-object request body', async (t) => {
  for (const body of [null, []]) {
    await t.test(JSON.stringify(body), async () => {
      const task = await createTask();
      const response = await sendJson(`/tasks/${task.id}`, 'PATCH', body);

      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), {
        error: 'Request body must be an object'
      });
    });
  }
});

test('PATCH with no supported fields is a no-op', async () => {
  const task = await createTask();

  const response = await sendJson(`/tasks/${task.id}`, 'PATCH', {
    note: 'ignored'
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), task);
});

test('DELETE removes a task and returns 204 with an empty body', async () => {
  const task = await createTask();

  const response = await fetch(`${baseUrl}/tasks/${task.id}`, {
    method: 'DELETE'
  });

  assert.equal(response.status, 204);
  assert.equal(await response.text(), '');

  const missing = await fetch(`${baseUrl}/tasks/${task.id}`);
  assert.equal(missing.status, 404);
});

test('DELETE returns 404 for a missing task', async () => {
  const response = await fetch(`${baseUrl}/tasks/999999`, {
    method: 'DELETE'
  });

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'Task not found' });
});

test('malformed JSON returns a simple JSON 400 response', async () => {
  const response = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{'
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Invalid JSON' });
});

test('PUT is not implemented', async () => {
  const response = await sendJson('/tasks/1', 'PUT', {
    title: 'Do not implement',
    completed: false
  });

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'Endpoint not found' });
});
