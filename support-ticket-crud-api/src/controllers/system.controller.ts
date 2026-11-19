import type { RequestHandler } from "express";

export const getRoot: RequestHandler = (_request, response) => {
  response.json({ message: "Hello from Express 5 with TypeScript!" });
};

export const getHealth: RequestHandler = (_request, response) => {
  response.json({ status: "ok" });
};

export const getStatus: RequestHandler = (_request, response) => {
  response.json({ service: "running" });
};
