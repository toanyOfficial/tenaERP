export type ImportPreviewRow<TParsed> = {
  rowNo: number;
  parsedData: TParsed;
  valid: boolean;
  errors: string[];
};

export type ImportValidationResult<TParsed> = {
  rows: ImportPreviewRow<TParsed>[];
  validRows: ImportPreviewRow<TParsed>[];
  invalidRows: ImportPreviewRow<TParsed>[];
  canImport: boolean;
};

export type ImportSummary = {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  selectedRows: number;
  importedRows: number;
};

export type BatchInfo = {
  batchGroup: string;
  batchSeq: number;
  title: string;
  executedDate?: Date;
};

export type ImportCommitInput<TParsed> = {
  selectedRows: number[];
  batchInfo: BatchInfo;
  rows: ImportPreviewRow<TParsed>[];
};

export type ImportCommitResult<TResult> = {
  selectedRows: number[];
  batchInfo: BatchInfo;
  importResult: TResult;
};
