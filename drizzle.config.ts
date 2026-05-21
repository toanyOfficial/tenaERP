import { defineConfig } from "drizzle-kit";
import { getRequiredDbConfig } from "@/lib/env";

const config = getRequiredDbConfig();

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema/**/*.{ts}",
  out: "./drizzle",
  dbCredentials: {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  },
  verbose: true,
  strict: true,
});
