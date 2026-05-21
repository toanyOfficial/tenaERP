import { z, type ZodTypeAny } from "zod";
import type { FieldValidationError, ValidationResult } from "@/lib/validation/types";

function toReason(issueCode: string): string {
  return issueCode;
}

export function formatValidationErrors(error: z.ZodError): FieldValidationError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "root",
    message: issue.message,
    reason: toReason(issue.code),
  }));
}

function buildSummaryMessage(errors: FieldValidationError[]) {
  if (errors.length === 0) {
    return "입력값이 올바르지 않습니다.";
  }

  const firstField = errors[0]?.field ?? "항목";
  const remain = errors.length - 1;

  if (remain <= 0) {
    return `${firstField} 항목을 확인해주세요.`;
  }

  return `${firstField} 항목 외 ${remain}건을 확인해주세요.`;
}

export function validateBody<TSchema extends ZodTypeAny>(
  schema: TSchema,
  input: unknown,
): ValidationResult<z.infer<TSchema>> {
  const parsed = schema.safeParse(input);

  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const errors = formatValidationErrors(parsed.error);
  return {
    success: false,
    message: buildSummaryMessage(errors),
    errors,
  };
}

export function validateQuery<TSchema extends ZodTypeAny>(
  schema: TSchema,
  input: unknown,
): ValidationResult<z.infer<TSchema>> {
  return validateBody(schema, input);
}

export function getFirstErrorField(errors: FieldValidationError[]): string | null {
  return errors[0]?.field ?? null;
}
