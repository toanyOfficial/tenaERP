export type ParsedPreviewRow = {
  rowNo: number;
  raw: string[];
  parsed: {
    targetYm: string;
    categoryCode: string;
    projectCode: string;
    amount: string;
    memo: string;
  };
};

export function parseExpensePreviewCsv(text: string): ParsedPreviewRow[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  const dataLines = lines[0].toLowerCase().includes("target") ? lines.slice(1) : lines;

  return dataLines.map((line, index) => {
    const cols = line.split(",").map((v) => v.trim());
    return {
      rowNo: index + 1,
      raw: cols,
      parsed: {
        targetYm: cols[0] ?? "",
        categoryCode: cols[1] ?? "",
        projectCode: cols[2] ?? "",
        amount: cols[3] ?? "",
        memo: cols[4] ?? "",
      },
    };
  });
}
