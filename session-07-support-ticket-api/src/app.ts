import express, { type Express } from "express";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middleware/error.middleware.js";
import { createTicketRouter } from "./routes/ticket.routes.js";
import { createTicketService } from "./services/ticket.service.js";
import { authRouter } from "./routes/auth.routes.js";

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });
  app.use("/api/auth", authRouter);
  app.use("/api/tickets", createTicketRouter(createTicketService()));
  app.use(errorHandler);

  return app;
}
