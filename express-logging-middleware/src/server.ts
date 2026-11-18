import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use((request, _response, next) => {
  console.log(`${request.method} ${request.path}`);
  next();
});

app.get("/", (_request, response) => {
  response.json({ message: "Hello from Express 5 with TypeScript!" });
});

app.get("/status", (_request, response) => {
  response.json({ service: "running" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
