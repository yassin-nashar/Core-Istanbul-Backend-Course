import express from 'express';
import { pathToFileURL } from 'node:url';

const app = express();

let tasks = [];
let nextId = 1;

export function resetTasks() {
  tasks = [];
  nextId = 1;
}

function findTask(id) {
  return tasks.find((task) => task.id === id);
}

function hasValidTitle(title) {
  return typeof title === 'string' && title.trim().length > 0;
}

app.use(express.json({ strict: false }));

app.get('/tasks', (request, response) => {
  response.status(200).json(tasks);
});

app.get('/tasks/:id', (request, response) => {
  const task = findTask(Number(request.params.id));

  if (!task) {
    response.status(404).json({ error: 'Task not found' });
    return;
  }

  response.status(200).json(task);
});

app.post('/tasks', (request, response) => {
  if (!hasValidTitle(request.body?.title)) {
    response.status(400).json({ error: 'Title is required' });
    return;
  }

  const task = {
    id: nextId,
    title: request.body.title.trim(),
    completed: false
  };

  nextId += 1;
  tasks.push(task);
  response.status(201).json(task);
});

app.patch('/tasks/:id', (request, response) => {
  const task = findTask(Number(request.params.id));

  if (!task) {
    response.status(404).json({ error: 'Task not found' });
    return;
  }

  const hasObjectBody = request.body !== null
    && typeof request.body === 'object'
    && !Array.isArray(request.body);

  if (!hasObjectBody) {
    response.status(400).json({ error: 'Request body must be an object' });
    return;
  }

  const hasTitle = Object.hasOwn(request.body ?? {}, 'title');
  const hasCompleted = Object.hasOwn(request.body ?? {}, 'completed');

  if (hasTitle && !hasValidTitle(request.body.title)) {
    response.status(400).json({ error: 'Title is required' });
    return;
  }

  if (hasCompleted && typeof request.body.completed !== 'boolean') {
    response.status(400).json({ error: 'Completed must be a boolean' });
    return;
  }

  if (hasTitle) {
    task.title = request.body.title.trim();
  }

  if (hasCompleted) {
    task.completed = request.body.completed;
  }

  response.status(200).json(task);
});

app.delete('/tasks/:id', (request, response) => {
  const taskIndex = tasks.findIndex(
    (task) => task.id === Number(request.params.id)
  );

  if (taskIndex === -1) {
    response.status(404).json({ error: 'Task not found' });
    return;
  }

  tasks.splice(taskIndex, 1);
  response.status(204).end();
});

app.use((request, response) => {
  response.status(404).json({ error: 'Endpoint not found' });
});

app.use((error, request, response, next) => {
  if (error instanceof SyntaxError && error.status === 400) {
    response.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  next(error);
});

const isDirectRun = process.argv[1]
  && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirectRun) {
  const port = Number(process.env.PORT ?? 3000);

  app.listen(port, () => {
    console.log(`Task Management API listening on http://localhost:${port}`);
  });
}

export default app;
