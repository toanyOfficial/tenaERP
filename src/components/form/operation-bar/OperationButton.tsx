import type { ButtonHTMLAttributes } from "react";

export type OperationButtonVariant = "default" | "primary" | "danger";

type OperationButtonProps = {
  label: string;
  variant?: OperationButtonVariant;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const VARIANT_CLASS: Record<OperationButtonVariant, string> = {
  default: "border-slate-300 bg-white text-slate-700",
  primary: "border-slate-900 bg-slate-900 text-white",
  danger: "border-rose-300 bg-rose-50 text-rose-700",
};

export function OperationButton({ label, variant = "default", type = "button", ...props }: OperationButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={`h-8 rounded border px-3 text-xs disabled:opacity-50 ${VARIANT_CLASS[variant]} ${props.className ?? ""}`}
    >
      {label}
    </button>
  );
}
