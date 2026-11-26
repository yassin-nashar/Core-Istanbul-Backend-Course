import { createApp } from "./app.js";
import { port } from "./config/env.js";
import { registerShutdownHandlers } from "./config/shutdown.js";

const server = createApp().listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
registerShutdownHandlers(server);
