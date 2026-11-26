import { createApp } from "./app.js";
import { port } from "./config/env.js";
import { registerShutdownHandlers } from "./config/shutdown.js";

const server = createApp().listen(port, "127.0.0.1", () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
registerShutdownHandlers(server);
