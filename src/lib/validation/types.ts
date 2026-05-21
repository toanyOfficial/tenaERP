export type FieldValidationError = {
  field: string;
  message: string;
  reason: string;
};

export type ValidationResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  message: string;
  errors: FieldValidationError[];
};
