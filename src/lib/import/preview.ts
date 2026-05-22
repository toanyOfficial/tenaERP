import type { ImportSummary, ImportValidationResult } from "@/lib/import/types";

export function createPreviewResult<TParsed>(validation: ImportValidationResult<TParsed>) {
  const summary: ImportSummary = {
    totalRows: validation.rows.length,
    validRows: validation.validRows.length,
    invalidRows: validation.invalidRows.length,
    selectedRows: validation.validRows.length,
    importedRows: 0,
  };

  return {
    summary,
    canImport: validation.canImport,
    items: validation.rows,
    invalidRows: validation.invalidRows,
  };
}
