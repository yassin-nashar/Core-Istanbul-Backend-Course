import type { RequestHandler } from "express";

export const loggingMiddleware: RequestHandler = (request, _response, next) => {
  console.log(`${request.method} ${request.path}`);
  next();
};
