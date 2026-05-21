import type { MySql2Database } from "drizzle-orm/mysql2";
import { db } from "@/db/client";
import * as schema from "@/db/schema";

export type DbTransaction = Parameters<Parameters<MySql2Database<typeof schema>["transaction"]>[0]>[0];

export async function withTransaction<T>(
  callback: (tx: DbTransaction) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    try {
      return await callback(tx);
    } catch (error) {
      tx.rollback();
      throw error;
    }
  });
}
