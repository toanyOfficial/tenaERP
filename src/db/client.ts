import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { getRequiredDbConfig } from "@/lib/env";
import * as schema from "@/db/schema";

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

function createDb(client: ReturnType<typeof createPool>) {
  return drizzle({ client, schema, mode: "default" });
}

type DbPool = ReturnType<typeof createPool>;
type DrizzleDb = ReturnType<typeof createDb>;

const globalForDb = globalThis as unknown as {
  pool?: DbPool;
  db?: DrizzleDb;
};

const pool = globalForDb.pool ?? createPool();
const db = globalForDb.db ?? createDb(pool);

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
  globalForDb.db = db;
}

export { pool, db };
