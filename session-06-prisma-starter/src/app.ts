import express, { type Express } from "express";

import { errorHandler } from "./middleware/error.middleware.js";

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });
  app.use(errorHandler);

  return app;
}
