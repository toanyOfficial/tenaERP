export type ImportPreviewRow = {
  rowNo: number;
  parsedData: Record<string, unknown>;
  rawData?: unknown;
  valid: boolean;
  errors: string[];
  importable?: boolean;
  errorMessage?: string | null;
};

export type ImportValidationSummary = {
  previewCount: number;
  validCount: number;
  invalidCount: number;
  canImport: boolean;
};

export type ImportResultState = {
  importedCount: number;
  batchGroup: string;
  batchSeq: number;
};
