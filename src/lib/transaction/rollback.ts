import { ApiError } from "@/lib/api";

export type RollbackContext = {
  operation: string;
  batchGroup?: string;
  batchSeq?: number;
  reason?: string;
};

export function handleTransactionFailure(error: unknown, context: RollbackContext): never {
  const message = error instanceof Error ? error.message : "Unknown transaction failure";

  console.error("[transaction:rollback]", {
    operation: context.operation,
    batchGroup: context.batchGroup,
    batchSeq: context.batchSeq,
    reason: context.reason,
    message,
  });

  if (error instanceof ApiError) {
    throw error;
  }

  throw new ApiError("트랜잭션 처리 중 오류가 발생했습니다.", "TRANSACTION_FAILED", 500, [
    { field: context.operation, message },
  ]);
}

export function rollbackTransaction(rollback: () => void, context: RollbackContext): void {
  try {
    rollback();
  } catch (rollbackError) {
    console.error("[transaction:rollback-error]", {
      operation: context.operation,
      batchGroup: context.batchGroup,
      batchSeq: context.batchSeq,
      rollbackError: rollbackError instanceof Error ? rollbackError.message : "Unknown rollback error",
    });
  }
}
