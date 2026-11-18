import express, { type ErrorRequestHandler } from "express";
import { z, ZodError } from "zod";

const app = express();

const portResult = z.coerce
  .number()
  .int()
  .min(1)
  .max(65535)
  .safeParse(process.env.PORT ?? "3000");

if (!portResult.success) {
  console.error("Invalid PORT: expected an integer between 1 and 65535.");
  process.exit(1);
}

const port = portResult.data;

const ticketSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

app.use((request, _response, next) => {
  console.log(`${request.method} ${request.path}`);
  next();
});

app.use(express.json());

app.get("/", (_request, response) => {
  response.json({ message: "Hello from Express 5 with TypeScript!" });
});

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/status", (_request, response) => {
  response.json({ service: "running" });
});

app.post("/api/tickets", (request, response, next) => {
  try {
    const ticket = ticketSchema.parse(request.body);
    response.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: { message: "Invalid ticket data" },
    });
    return;
  }

  console.error(error);
  response.status(500).json({
    error: { message: "Internal server error" },
  });
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
