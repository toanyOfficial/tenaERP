import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className = "", readOnly, disabled, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      readOnly={readOnly}
      disabled={disabled}
      {...props}
      className={`h-8 w-full rounded border px-2 text-xs outline-none ${invalid ? "border-rose-400" : "border-slate-300"} ${readOnly ? "bg-slate-100" : "bg-white"} ${disabled ? "cursor-not-allowed opacity-60" : ""} focus:border-slate-500 ${className}`}
    />
  );
});
