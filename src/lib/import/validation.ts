import type { ImportPreviewRow, ImportValidationResult } from "@/lib/import/types";

export function validateImportRows<TRaw, TParsed>(
  rows: Array<{ rowNo: number; parsedData: TRaw }>,
  parser: (raw: TRaw) => { success: true; data: TParsed } | { success: false; errors: string[] },
  businessValidator?: (parsed: TParsed) => { valid: boolean; errors: string[] },
): ImportValidationResult<TParsed | TRaw> {
  const normalizedRows: Array<ImportPreviewRow<TParsed | TRaw>> = rows.map((row) => {
    const parsed = parser(row.parsedData);

    if (!parsed.success) {
      return {
        rowNo: row.rowNo,
        parsedData: row.parsedData,
        valid: false,
        errors: parsed.errors,
      };
    }

    const business = businessValidator ? businessValidator(parsed.data) : { valid: true, errors: [] as string[] };

    return {
      rowNo: row.rowNo,
      parsedData: parsed.data,
      valid: business.valid,
      errors: business.errors,
    };
  });

  const validRows = normalizedRows.filter((row) => row.valid);
  const invalidRows = normalizedRows.filter((row) => !row.valid);

  return {
    rows: normalizedRows,
    validRows,
    invalidRows,
    canImport: normalizedRows.length > 0 && invalidRows.length === 0,
  };
}
