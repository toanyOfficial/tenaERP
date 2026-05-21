import { and, eq } from "drizzle-orm";
import { ApiError, ValidationApiError } from "@/lib/api";
import { withTransaction, db, dbSchema } from "@/db";
import type { ExpenseCommitInput } from "@/modules/profit-loss/validators/expense-commit";
import { expenseRowSchema, validateExpenseRowBusiness } from "@/modules/profit-loss/validators/expense-preview";

export async function commitExpenseImport(input: ExpenseCommitInput, actorId: number) {
  const [duplicate] = await db
    .select({ id: dbSchema.batchLog.id })
    .from(dbSchema.batchLog)
    .where(and(eq(dbSchema.batchLog.batchGroup, input.batchGroup), eq(dbSchema.batchLog.batchSeq, input.batchSeq)))
    .limit(1);

  if (duplicate) {
    throw new ApiError("이미 실행된 배치입니다.", "DUPLICATE_BATCH", 409);
  }

  const importedCount = await withTransaction(async (tx) => {
    for (const [index, row] of input.rows.entries()) {
      const parsed = expenseRowSchema.safeParse({
        targetYm: row.targetYm,
        categoryCode: row.categoryCode,
        projectCode: row.projectCode,
        amount: row.amount,
        memo: row.memo,
      });

      if (!parsed.success) {
        throw new ValidationApiError("유효하지 않은 행이 포함되어 있습니다.", [{ field: `rows.${index}`, message: parsed.error.issues[0]?.message ?? "형식 오류" }]);
      }

      const business = validateExpenseRowBusiness(parsed.data);
      if (!business.valid) {
        throw new ValidationApiError("유효하지 않은 행이 포함되어 있습니다.", [{ field: `rows.${index}`, message: business.errors[0] ?? "검증 오류" }]);
      }

      await tx.insert(dbSchema.expense).values({
        targetYm: parsed.data.targetYm,
        categoryCode: parsed.data.categoryCode || null,
        projectCode: parsed.data.projectCode || null,
        amount: parsed.data.amount,
        memo: parsed.data.memo || null,
        createdBy: actorId,
        updatedBy: actorId,
      });
    }

    await tx.insert(dbSchema.batchLog).values({
      batchGroup: input.batchGroup,
      batchSeq: input.batchSeq,
      title: input.title,
      executedDate: new Date(),
    });

    return input.rows.length;
  });

  return { importedCount, batchGroup: input.batchGroup, batchSeq: input.batchSeq };
}
