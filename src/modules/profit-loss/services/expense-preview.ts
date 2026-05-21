import { eq } from "drizzle-orm";
import { db, dbSchema } from "@/db";
import { createPreviewResult, validateImportRows } from "@/lib/import";
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

  const validation = validateImportRows(
    rows.map((row) => ({ rowNo: row.rowNo, parsedData: row.parsed })),
    (raw) => {
      const parsed = expenseRowSchema.safeParse(raw);
      if (!parsed.success) {
        return { success: false as const, errors: parsed.error.issues.map((issue) => issue.message) };
      }
      return { success: true as const, data: parsed.data };
    },
    validateExpenseRowBusiness,
  );

  const preview = createPreviewResult(validation);

  return {
    previewCount: preview.summary.totalRows,
    validCount: preview.summary.validRows,
    invalidCount: preview.summary.invalidRows,
    canImport: preview.canImport,
    batchLog: {
      duplicatedGroup: !!lastBatch,
      latestBatchSeq: lastBatch?.batchSeq ?? null,
      latestExecutedDate: lastBatch?.executedDate ?? null,
    },
    items: preview.items,
    invalidRows: preview.invalidRows,
  };
}
