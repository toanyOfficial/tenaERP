import { env } from "@/lib/env";

export const dbConfig = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  name: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
} as const;
