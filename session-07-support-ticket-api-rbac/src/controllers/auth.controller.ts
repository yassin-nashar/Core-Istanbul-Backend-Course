import type { RequestHandler, Response } from "express";
import { env } from "../config/env.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { authService } from "../services/auth.service.js";

const cookieName = "refresh_token";
const cookieBase = { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: "strict" as const, path: "/api/auth" };
function setRefreshCookie(response: Response, token: string, expires: Date): void { response.cookie(cookieName, token, { ...cookieBase, expires }); }
function readRefreshCookie(value: unknown): string | undefined { return typeof value === "string" ? value : undefined; }

export const register: RequestHandler = async (request, response) => {
  response.status(201).json({ user: await authService.register(registerSchema.parse(request.body)) });
};
export const login: RequestHandler = async (request, response) => {
  const result = await authService.login(loginSchema.parse(request.body));
  setRefreshCookie(response, result.refreshToken, result.expiresAt);
  response.status(200).json({ user: result.user, accessToken: result.accessToken });
};
export const refresh: RequestHandler = async (request, response) => {
  const raw = readRefreshCookie(request.cookies?.[cookieName]);
  if (!raw) { response.status(401).json({ error: { message: "Invalid refresh token" } }); return; }
  const result = await authService.refresh(raw);
  setRefreshCookie(response, result.refreshToken, result.expiresAt);
  response.status(200).json({ user: result.user, accessToken: result.accessToken });
};
export const logout: RequestHandler = async (request, response) => {
  await authService.logout(readRefreshCookie(request.cookies?.[cookieName]));
  response.clearCookie(cookieName, cookieBase).status(204).send();
};
