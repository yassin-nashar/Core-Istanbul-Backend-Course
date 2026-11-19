import { z } from "zod";

const portResult = z.coerce
  .number()
  .int()
  .min(1)
  .max(65535)
  .safeParse(process.env.PORT ?? "3000");

if (!portResult.success) {
  console.error("Invalid PORT: expected an integer between 1 and 65535.");
  process.exit(1);
}

export const env = {
  port: portResult.data,
};
