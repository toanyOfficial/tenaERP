"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/modal";
import { PreviewGrid } from "@/components/import/PreviewGrid";
import { ValidationSummary } from "@/components/import/ValidationSummary";
import { ImportResult } from "@/components/import/ImportResult";
import type { ImportPreviewRow, ImportResultState, ImportValidationSummary } from "@/components/import/types";

export function ImportModal(props: {
  open: boolean;
  onClose: () => void;
  title: string;
  accept?: string;
  previewUrl: string;
  commitUrl: string;
  batchGroup: string;
  commitTitle: string;
  onCommitted?: () => Promise<void>;
}) {
  const [rows, setRows] = useState<ImportPreviewRow[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [summary, setSummary] = useState<ImportValidationSummary | null>(null);
  const [result, setResult] = useState<ImportResultState | null>(null);
  const [rollbackError, setRollbackError] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingCommit, setLoadingCommit] = useState(false);

  const invalidRows = useMemo(() => rows.filter((row) => !(row.importable ?? row.valid)).length, [rows]);

  async function handleUpload(file: File) {
    setResult(null);
    setRollbackError(null);
    setLoadingPreview(true);

    try {
      const form = new FormData();
      form.set("file", file);

      const res = await fetch(props.previewUrl, { method: "POST", body: form });
      const json = await res.json();
      if (!json.success) {
        setRollbackError(json.error?.message ?? "Preview 실패");
        return;
      }

      const data = json.data;
      const previewRows = (data.items ?? []) as ImportPreviewRow[];
      setRows(previewRows);
      setSummary({
        previewCount: data.previewCount ?? previewRows.length,
        validCount: data.validCount ?? previewRows.filter((row) => row.valid).length,
        invalidCount: data.invalidCount ?? previewRows.filter((row) => !row.valid).length,
        canImport: Boolean(data.canImport),
      });
      setSelected(previewRows.map((_, i) => i).filter((i) => (previewRows[i].importable ?? previewRows[i].valid)));
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleCommit() {
    setResult(null);
    setRollbackError(null);
    setLoadingCommit(true);

    try {
      const commitRows = selected.map((i) => rows[i].parsedData);
      const res = await fetch(props.commitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchGroup: props.batchGroup,
          batchSeq: Date.now(),
          title: props.commitTitle,
          rows: commitRows,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        setRollbackError(json.error?.message ?? "Commit 실패");
        return;
      }

      setResult(json.data as ImportResultState);
      if (props.onCommitted) await props.onCommitted();
    } finally {
      setLoadingCommit(false);
    }
  }

  if (!props.open) return null;

  return (
    <Modal
      open={props.open}
      title={props.title}
      onClose={props.onClose}
      size="large"
      footer={
        <button
          className="rounded border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loadingCommit || selected.length === 0 || invalidRows > 0}
          onClick={() => void handleCommit()}
        >
          {loadingCommit ? "Import 중..." : `Import Commit (${selected.length})`}
        </button>
      }
    >
      <div className="space-y-2">
        <input
          type="file"
          accept={props.accept ?? ".csv,text/csv"}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleUpload(f);
          }}
        />
        <ValidationSummary summary={summary} />
        <PreviewGrid
          rows={rows}
          selected={selected}
          loading={loadingPreview}
          errorMessage={rollbackError}
          onToggle={(index, checked) =>
            setSelected((prev) => (checked ? [...prev, index] : prev.filter((v) => v !== index)))
          }
        />
        <ImportResult result={result} rollbackError={rollbackError} />
      </div>
    </Modal>
  );
}
