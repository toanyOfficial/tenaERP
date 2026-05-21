"use client";

export function CredentialField(props: { value: string; canCopy: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="truncate font-mono text-[11px]">{props.value || "-"}</span>
      {props.canCopy ? (
        <button type="button" className="h-6 rounded border border-slate-300 px-2 text-[11px]" onClick={() => navigator.clipboard.writeText(props.value)}>
          복사
        </button>
      ) : null}
    </div>
  );
}
