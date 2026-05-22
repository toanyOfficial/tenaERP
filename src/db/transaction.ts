import type { MySql2Database } from "drizzle-orm/mysql2";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { executeTransactionWork } from "@/lib/transaction";
import type { RollbackContext } from "@/lib/transaction";

export type DbTransaction = Parameters<Parameters<MySql2Database<typeof schema>["transaction"]>[0]>[0];

export async function executeTransaction<T>(
  callback: (tx: DbTransaction) => Promise<T>,
  context: RollbackContext = { operation: "default" },
): Promise<T> {
  return db.transaction(async (tx) => executeTransactionWork(tx, callback, context));
}

export async function withTransaction<T>(callback: (tx: DbTransaction) => Promise<T>): Promise<T> {
  return executeTransaction(callback, { operation: "withTransaction" });
}
