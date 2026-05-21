import type { FieldValidationError } from "@/lib/validation";

export function focusFirstErrorField(errors: FieldValidationError[]) {
  const firstField = errors[0]?.field;
  if (!firstField) return;

  const target = document.getElementById(firstField) as HTMLElement | null;
  if (!target) return;

  target.focus();
}
