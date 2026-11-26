import { createApp } from "./app.js";
import { port } from "./config/env.js";
import { registerShutdownHandlers } from "./config/shutdown.js";
import { env } from "./config/env.js";

if (env.NODE_ENV === "production") throw new Error("Training audit project refuses to start in production mode");

const server = createApp().listen(port, "127.0.0.1", () => {
  console.warn("WARNING: intentionally insecure classroom API — localhost use only");
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
registerShutdownHandlers(server);
