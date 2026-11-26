import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import { errorHandler } from "./middleware/error.middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import { eventRouter } from "./routes/event.routes.js";
import { bookingRouter } from "./routes/booking.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { env } from "./config/env.js";

export function createApp(): Express {
  const app = express();
  app.use(helmet());
  app.use(rateLimit({windowMs:60_000,limit:env.API_RATE_LIMIT_MAX,standardHeaders:"draft-7",legacyHeaders:false,message:{error:{message:"Too many requests"}}}));
  app.use(express.json());
  app.use(cookieParser());
  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });
  app.use("/api/auth", rateLimit({windowMs:60_000,limit:env.AUTH_RATE_LIMIT_MAX,standardHeaders:"draft-7",legacyHeaders:false,message:{error:{message:"Too many authentication requests"}}}), authRouter);
  app.use("/api/events", eventRouter);
  app.use("/api/bookings", bookingRouter);
  app.use("/api/users", userRouter);
  app.use(errorHandler);

  return app;
}
