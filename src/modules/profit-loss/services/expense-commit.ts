import { ValidationApiError } from "@/lib/api";
import { executeTransaction, dbSchema } from "@/db";
import { createBatchLog, validateBatchExecution } from "@/lib/batch";
import { assertImportableRows, filterSelectedRows } from "@/lib/import";
import type { ExpenseCommitInput } from "@/modules/profit-loss/validators/expense-commit";
import { expenseRowSchema, validateExpenseRowBusiness } from "@/modules/profit-loss/validators/expense-preview";

export async function commitExpenseImport(input: ExpenseCommitInput, actorId: number) {
  await validateBatchExecution({ batchGroup: input.batchGroup, batchSeq: input.batchSeq });

  const selectedRows = input.rows;
  const selectedRowNos = selectedRows.map((_, index) => index + 1);
  const selectedPreviewRows = filterSelectedRows(
    selectedRows.map((row, index) => {
      const parsed = expenseRowSchema.safeParse({
        targetYm: row.targetYm,
        categoryCode: row.categoryCode,
        projectCode: row.projectCode,
        amount: row.amount,
        memo: row.memo
      });

      if (!parsed.success) {
        return {
          rowNo: index + 1,
          parsedData: row,
          valid: false,
          errors: parsed.error.issues.map((issue) => issue.message),
        };
      }

      const business = validateExpenseRowBusiness(parsed.data);
      return {
        rowNo: index + 1,
        parsedData: parsed.data,
        valid: business.valid,
        errors: business.errors,
      };
    }),
    selectedRowNos,
  );

  try {
    assertImportableRows(selectedPreviewRows);
  } catch {
    throw new ValidationApiError("유효하지 않은 행이 포함되어 있습니다.", [{ field: "rows", message: "선택한 행 중 유효하지 않은 데이터가 포함되어 있습니다." }]);
  }

  const importedCount = await executeTransaction(async (tx) => {
    for (const [index, previewRow] of selectedPreviewRows.entries()) {
      const parsedData = previewRow.parsedData;

      const parsed = expenseRowSchema.safeParse(parsedData);
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

    await createBatchLog(
      {
        batchGroup: input.batchGroup,
        batchSeq: input.batchSeq,
        title: input.title,
        executedDate: new Date(),
      },
      tx,
    );

    return selectedPreviewRows.length;
  }, { operation: "commitExpenseImport", batchGroup: input.batchGroup, batchSeq: input.batchSeq });

  return { importedCount, batchGroup: input.batchGroup, batchSeq: input.batchSeq };
}
