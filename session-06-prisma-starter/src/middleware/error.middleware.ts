import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: { message: error.issues[0]?.message ?? "Invalid request" },
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({ error: { message: error.message } });
    return;
  }

  console.error(error);
  response.status(500).json({ error: { message: "Internal server error" } });
};
