import type { ImportValidationSummary } from "@/components/import/types";

export function ValidationSummary({ summary }: { summary: ImportValidationSummary | null }) {
  if (!summary) return null;

  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-2 text-xs">
      <div>Preview: {summary.previewCount}</div>
      <div>Valid: {summary.validCount}</div>
      <div className={summary.invalidCount > 0 ? "text-rose-600" : ""}>Invalid: {summary.invalidCount}</div>
      <div>Import 가능: {summary.canImport ? "YES" : "NO"}</div>
    </div>
  );
}
