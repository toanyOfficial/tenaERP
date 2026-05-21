"use client";

import { ImportModal } from "@/components/import";

export function ExpenseImportModal(props: { open: boolean; onClose: () => void; onCommitted: () => Promise<void> }) {
  return (
    <ImportModal
      open={props.open}
      onClose={props.onClose}
      title="지출 업로드"
      previewUrl="/api/profit-loss/expense/preview"
      commitUrl="/api/profit-loss/expense/commit"
      batchGroup="EXPENSE_IMPORT"
      commitTitle="expense import"
      onCommitted={props.onCommitted}
    />
  );
}
