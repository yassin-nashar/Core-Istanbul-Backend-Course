import http from 'node:http';
import { pathToFileURL } from 'node:url';

const seedTask = Object.freeze({
  id: 3,
  title: 'Learn REST',
  completed: false
});

let task = { ...seedTask };

export function resetTask() {
  task = { ...seedTask };
}

export function getTask() {
  return task;
}

function sendJson(response, statusCode, body, extraHeaders = {}) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    ...extraHeaders
  });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  let rawBody = '';

  for await (const chunk of request) {
    rawBody += chunk;
  }

  return JSON.parse(rawBody);
}

export function createServer() {
  return http.createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');

    if (url.pathname !== '/tasks/3') {
      sendJson(response, 404, { error: 'Not Found' });
      return;
    }

    if (request.method === 'GET') {
      sendJson(response, 200, task);
      return;
    }

    if (request.method === 'PUT') {
      let body;

      try {
        body = await readJson(request);
      } catch {
        sendJson(response, 400, { error: 'Invalid JSON' });
        return;
      }

      const id = 3;

      // INTENTIONALLY BUGGY — FOR TRAINING ONLY
      const updated = {
        id,
        title: body.title,
        completed: body.completed
      };

      task = updated;
      sendJson(response, 200, updated);
      return;
    }

    sendJson(
      response,
      405,
      { error: 'Method Not Allowed' },
      { allow: 'GET, PUT' }
    );
  });
}

const isDirectRun = process.argv[1]
  && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirectRun) {
  const port = Number(process.env.PORT ?? 3000);
  const server = createServer();

  server.listen(port, () => {
    console.log(`PUT training demo listening on http://localhost:${port}`);
  });
}
