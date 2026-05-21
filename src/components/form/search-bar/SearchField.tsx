import type { InputHTMLAttributes, ReactNode } from "react";

type SearchFieldProps = {
  label: string;
  htmlFor: string;
  children?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export function SearchField({ label, htmlFor, children, ...inputProps }: SearchFieldProps) {
  return (
    <div className="flex min-w-[220px] items-center gap-2">
      <label htmlFor={htmlFor} className="w-20 shrink-0 text-xs font-medium text-slate-600">
        {label}
      </label>
      {children ?? (
        <input
          id={htmlFor}
          {...inputProps}
          className="h-8 w-full rounded border border-slate-300 px-2 text-xs text-slate-800 outline-none focus:border-slate-500"
        />
      )}
    </div>
  );
}
