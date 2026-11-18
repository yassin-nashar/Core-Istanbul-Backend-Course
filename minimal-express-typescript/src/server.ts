import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.get("/", (_request, response) => {
  response.json({ message: "Hello from Express 5 with TypeScript!" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
