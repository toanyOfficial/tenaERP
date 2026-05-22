import type { DbTransaction } from "@/db/transaction";
import { rollbackTransaction, handleTransactionFailure, type RollbackContext } from "@/lib/transaction/rollback";

export async function executeTransactionWork<T>(
  tx: DbTransaction,
  callback: (tx: DbTransaction) => Promise<T>,
  context: RollbackContext,
): Promise<T> {
  try {
    return await callback(tx);
  } catch (error) {
    rollbackTransaction(() => tx.rollback(), context);
    handleTransactionFailure(error, context);
  }
}
