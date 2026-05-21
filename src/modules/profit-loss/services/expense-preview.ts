import { eq } from "drizzle-orm";
import { db, dbSchema } from "@/db";
import { bindRawData, createPreviewResult, validateImportRows } from "@/lib/import";
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
    rows.map((row) => ({ rowNo: row.rowNo, parsedData: bindRawData(row.parsed, row.raw) })),
    (input) => {
      const parsed = expenseRowSchema.safeParse(input.parsedData);
      if (!parsed.success) {
        return { success: false as const, errors: parsed.error.issues.map((issue) => issue.message) };
      }
      return { success: true as const, data: bindRawData(parsed.data, input.rawData) };
    },
    (row) => validateExpenseRowBusiness(row.parsedData),
  );

  const preview = createPreviewResult(validation);
  const items = preview.items.map((row) => ({
    rowNo: row.rowNo,
    parsedData: row.parsedData.parsedData,
    rawData: row.parsedData.rawData,
    valid: row.valid,
    errors: row.errors,
    validation: { valid: row.valid, errors: row.errors },
    importable: row.valid,
    errorMessage: row.valid ? null : row.errors[0] ?? "검증 오류",
  }));

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
    items,
    invalidRows: items.filter((row) => !row.importable),
  };
}
