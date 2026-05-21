import type { ReactNode } from "react";
import { FieldError } from "@/components/form/input/FieldError";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  errorMessage?: string | null;
  children: ReactNode;
};

export function FormField({ label, htmlFor, required, errorMessage, children }: FormFieldProps) {
  return (
    <div className="grid grid-cols-[100px_1fr] items-start gap-2">
      <label htmlFor={htmlFor} className="pt-2 text-xs font-medium text-slate-700">
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </label>
      <div>
        {children}
        <FieldError message={errorMessage} />
      </div>
    </div>
  );
}
