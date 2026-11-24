import { createApp } from "./app.js";
import { port } from "./config/env.js";

createApp().listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
