import type { ReactNode } from "react";
import { OperationButton } from "@/components/form/operation-bar/OperationButton";

type OperationBarProps = {
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  onReset?: () => void;
  resetDisabled?: boolean;
};

export function OperationBar({ leftActions, rightActions, onReset, resetDisabled }: OperationBarProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-white px-3 py-2">
      <div className="flex items-center gap-2">
        {leftActions}
      </div>
      <div className="flex items-center gap-2">
        {rightActions}
        <OperationButton label="초기화" onClick={onReset} disabled={resetDisabled} />
      </div>
    </div>
  );
}

export function DefaultOperationActions(props: {
  onCreate?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onUpload?: () => void;
}) {
  return (
    <>
      <OperationButton label="신규" onClick={props.onCreate} />
      <OperationButton label="저장" variant="primary" onClick={props.onSave} />
      <OperationButton label="삭제" variant="danger" onClick={props.onDelete} />
      <OperationButton label="업로드" onClick={props.onUpload} />
    </>
  );
}
