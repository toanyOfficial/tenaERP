"use client";

type Props = {
  title?: string;
  onClose?: () => void;
};

export function ModalHeader({ title, onClose }: Props) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      {onClose ? (
        <button type="button" onClick={onClose} className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600">
          닫기
        </button>
      ) : null}
    </header>
  );
}
