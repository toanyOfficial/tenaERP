import type { ImportResultState } from "@/components/import/types";

export function ImportResult(props: { result: ImportResultState | null; rollbackError: string | null }) {
  if (props.rollbackError) {
    return <div className="rounded border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">Rollback 실패/커밋 실패: {props.rollbackError}</div>;
  }

  if (!props.result) return null;

  return (
    <div className="rounded border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700">
      Imported: {props.result.importedCount} / Batch: {props.result.batchGroup}#{props.result.batchSeq}
    </div>
  );
}
