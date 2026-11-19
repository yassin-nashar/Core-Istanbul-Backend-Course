import express from "express";

import { errorMiddleware } from "./middleware/error.middleware.js";
import { loggingMiddleware } from "./middleware/logging.middleware.js";
import { systemRouter } from "./routes/system.routes.js";
import { ticketRouter } from "./routes/ticket.routes.js";

export const app = express();

app.use(loggingMiddleware);
app.use(express.json());

app.use(systemRouter);
app.use("/api/tickets", ticketRouter);

app.use(errorMiddleware);
