import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  options: SelectOption[];
  invalid?: boolean;
  placeholder?: string;
  readOnly?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, invalid, className = "", readOnly, disabled, placeholder, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      disabled={disabled || readOnly}
      {...props}
      className={`h-8 w-full rounded border px-2 text-xs outline-none ${invalid ? "border-rose-400" : "border-slate-300"} ${readOnly ? "bg-slate-100" : "bg-white"} ${disabled ? "cursor-not-allowed opacity-60" : ""} focus:border-slate-500 ${className}`}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});
