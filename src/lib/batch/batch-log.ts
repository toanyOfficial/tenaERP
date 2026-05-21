import { and, desc, eq } from "drizzle-orm";
import { db, dbSchema } from "@/db";
import type { DbTransaction } from "@/db/transaction";
import { ApiError } from "@/lib/api";
import type { BatchIdentity, CreateBatchLogInput } from "@/lib/batch/types";

export async function existsBatchLog(input: BatchIdentity): Promise<boolean> {
  const [row] = await db
    .select({ id: dbSchema.batchLog.id })
    .from(dbSchema.batchLog)
    .where(and(eq(dbSchema.batchLog.batchGroup, input.batchGroup), eq(dbSchema.batchLog.batchSeq, input.batchSeq)))
    .limit(1);

  return Boolean(row);
}

export async function createBatchLog(input: CreateBatchLogInput, tx?: DbTransaction): Promise<void> {
  const executor = tx ?? db;

  await executor.insert(dbSchema.batchLog).values({
    batchGroup: input.batchGroup,
    batchSeq: input.batchSeq,
    title: input.title,
    executedDate: input.executedDate ?? new Date(),
  });
}

export async function getNextBatchSeq(batchGroup: string): Promise<number> {
  const [latest] = await db
    .select({ batchSeq: dbSchema.batchLog.batchSeq })
    .from(dbSchema.batchLog)
    .where(eq(dbSchema.batchLog.batchGroup, batchGroup))
    .orderBy(desc(dbSchema.batchLog.batchSeq))
    .limit(1);

  return latest ? latest.batchSeq + 1 : 1;
}

export async function validateBatchExecution(input: BatchIdentity): Promise<void> {
  const exists = await existsBatchLog(input);

  if (exists) {
    throw new ApiError("이미 실행된 배치입니다.", "DUPLICATE_BATCH", 409);
  }
}
