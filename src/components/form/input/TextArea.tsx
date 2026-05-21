import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { invalid, className = "", readOnly, disabled, rows = 3, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      readOnly={readOnly}
      disabled={disabled}
      {...props}
      className={`w-full rounded border px-2 py-2 text-xs outline-none ${invalid ? "border-rose-400" : "border-slate-300"} ${readOnly ? "bg-slate-100" : "bg-white"} ${disabled ? "cursor-not-allowed opacity-60" : ""} focus:border-slate-500 ${className}`}
    />
  );
});
