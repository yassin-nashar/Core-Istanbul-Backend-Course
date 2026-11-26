import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  JWT_SECRET: z.string().min(32),
  JWT_ISSUER: z.string().min(1).default("session-07-event-booking-api"),
  JWT_AUDIENCE: z.string().min(1).default("session-07-client"),
  ACCESS_TOKEN_TTL: z.string().regex(/^\d+[smhd]$/).default("15m"),
  REFRESH_SESSION_TTL_DAYS: z.coerce.number().int().positive().default(7),
  API_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
});

const parsed = environmentSchema.safeParse(process.env);
if (!parsed.success) throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`);
export const env = parsed.data;
export const port = env.PORT;
