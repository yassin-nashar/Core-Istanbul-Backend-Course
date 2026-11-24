import "dotenv/config";

const configuredPort = Number.parseInt(process.env.PORT ?? "3000", 10);

export const port = Number.isNaN(configuredPort) ? 3000 : configuredPort;
