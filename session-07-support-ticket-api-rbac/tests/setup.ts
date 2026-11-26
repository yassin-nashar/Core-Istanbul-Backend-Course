const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("TEST_DATABASE_URL is required to run tests");
const databaseName = new URL(databaseUrl).pathname.slice(1).toLowerCase();
if (!databaseName.includes("test")) {
  throw new Error(`Refusing to run destructive tests against non-test database: ${databaseName}`);
}
