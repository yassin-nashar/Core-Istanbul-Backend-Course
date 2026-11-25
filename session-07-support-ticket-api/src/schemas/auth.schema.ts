import { z } from "zod";

const email = z.email().trim().toLowerCase();
const password = z.string().min(12, "Password must contain at least 12 characters").max(128);
export const registerSchema = z.object({ name: z.string().trim().min(1).max(100), email, password });
export const loginSchema = z.object({ email, password: z.string().min(1).max(128) });
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
