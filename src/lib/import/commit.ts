import type { ImportCommitInput, ImportCommitResult, ImportPreviewRow, ImportSummary } from "@/lib/import/types";

export function filterSelectedRows<TParsed>(rows: ImportPreviewRow<TParsed>[], selectedRows: number[]) {
  const selectedSet = new Set(selectedRows);

  return rows.filter((row) => selectedSet.has(row.rowNo));
}

export function assertImportableRows<TParsed>(rows: ImportPreviewRow<TParsed>[]) {
  const invalid = rows.filter((row) => !row.valid);

  if (invalid.length > 0) {
    throw new Error("선택한 행 중 유효하지 않은 데이터가 포함되어 있습니다.");
  }
}

export function createImportSummary(input: {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  selectedRows: number;
  importedRows: number;
}): ImportSummary {
  return {
    totalRows: input.totalRows,
    validRows: input.validRows,
    invalidRows: input.invalidRows,
    selectedRows: input.selectedRows,
    importedRows: input.importedRows,
  };
}

export function createCommitResult<TResult>(
  input: Omit<ImportCommitInput<unknown>, "rows">,
  importResult: TResult,
): ImportCommitResult<TResult> {
  return {
    selectedRows: input.selectedRows,
    batchInfo: input.batchInfo,
    importResult,
  };
}
