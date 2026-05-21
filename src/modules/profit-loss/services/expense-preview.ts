import { and, eq } from "drizzle-orm";
import { db, dbSchema } from "@/db";
import { parseExpensePreviewCsv } from "@/modules/profit-loss/parsers/expense-preview";
import { expenseRowSchema, validateExpenseRowBusiness } from "@/modules/profit-loss/validators/expense-preview";

export async function buildExpensePreview(fileText: string) {
  const rows = parseExpensePreviewCsv(fileText);

  const [lastBatch] = await db
    .select({ batchGroup: dbSchema.batchLog.batchGroup, batchSeq: dbSchema.batchLog.batchSeq, executedDate: dbSchema.batchLog.executedDate })
    .from(dbSchema.batchLog)
    .where(eq(dbSchema.batchLog.batchGroup, "EXPENSE_IMPORT"))
    .orderBy(dbSchema.batchLog.batchSeq)
    .limit(1);

  const items = rows.map((row) => {
    const parsedResult = expenseRowSchema.safeParse(row.parsed);
    if (!parsedResult.success) {
      return {
        rowNo: row.rowNo,
        parsedData: row.parsed,
        validation: { valid: false, errors: parsedResult.error.issues.map((i) => i.message) },
        importable: false,
        errorMessage: parsedResult.error.issues[0]?.message ?? "형식 오류",
      };
    }

    const business = validateExpenseRowBusiness(parsedResult.data);
    return {
      rowNo: row.rowNo,
      parsedData: parsedResult.data,
      validation: { valid: business.valid, errors: business.errors },
      importable: business.valid,
      errorMessage: business.valid ? null : business.errors[0],
    };
  });

  const invalidRows = items.filter((row) => !row.importable);
  return {
    previewCount: items.length,
    validCount: items.length - invalidRows.length,
    invalidCount: invalidRows.length,
    canImport: invalidRows.length === 0 && items.length > 0,
    batchLog: {
      duplicatedGroup: !!lastBatch,
      latestBatchSeq: lastBatch?.batchSeq ?? null,
      latestExecutedDate: lastBatch?.executedDate ?? null,
    },
    items,
    invalidRows,
  };
}
