import { Router } from "express";

import {
  getHealth,
  getRoot,
  getStatus,
} from "../controllers/system.controller.js";

export const systemRouter = Router();

systemRouter.get("/", getRoot);
systemRouter.get("/health", getHealth);
systemRouter.get("/status", getStatus);
