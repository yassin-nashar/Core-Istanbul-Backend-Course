import express, { type Express } from "express";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middleware/error.middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import { eventRouter } from "./routes/event.routes.js";
import { bookingRouter } from "./routes/booking.routes.js";
import { userRouter } from "./routes/user.routes.js";

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });
  app.use("/api/auth", authRouter);
  app.use("/api/events", eventRouter);
  app.use("/api/bookings", bookingRouter);
  app.use("/api/users", userRouter);
  app.use(errorHandler);

  return app;
}
