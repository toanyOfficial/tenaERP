import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { getRequiredDbConfig } from "@/lib/env";
import * as schema from "@/db/schema";

const globalForDb = globalThis as unknown as {
  pool?: mysql.Pool;
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

function createPool() {
  const config = getRequiredDbConfig();

  return mysql.createPool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

const pool = globalForDb.pool ?? createPool();
const db = globalForDb.db ?? drizzle({ client: pool, schema, mode: "default" });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
  globalForDb.db = db;
}

export { pool, db };
