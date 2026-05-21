import { failResponse, serverErrorResponse, validationErrorResponse } from "@/lib/api/response";
import { ApiError, UnauthorizedApiError } from "@/lib/api/errors";
import { formatValidationErrors } from "@/lib/validation";
import { z } from "zod";

type DbLikeError = {
  code?: string;
  errno?: number;
  message?: string;
};

export function normalizeDbError(error: unknown): ApiError | null {
  const dbError = error as DbLikeError;

  if (dbError?.code === "ER_DUP_ENTRY" || dbError?.errno === 1062) {
    return new ApiError("중복된 데이터가 존재합니다.", "DUPLICATE_KEY", 409);
  }

  if (dbError?.code === "ER_NO_REFERENCED_ROW_2" || dbError?.errno === 1452) {
    return new ApiError("참조 무결성 제약조건을 위반했습니다.", "DB_CONSTRAINT", 400);
  }

  if (dbError?.code === "ER_ROW_IS_REFERENCED_2" || dbError?.errno === 1451) {
    return new ApiError("참조 중인 데이터는 처리할 수 없습니다.", "DB_CONSTRAINT", 400);
  }

  return null;
}

export function normalizeValidationError(error: unknown): ApiError | null {
  if (!(error instanceof z.ZodError)) {
    return null;
  }

  const errors = formatValidationErrors(error).map((item) => ({
    field: item.field,
    message: item.message,
  }));

  return new ApiError("입력값이 올바르지 않습니다.", "VALIDATION_ERROR", 400, errors);
}

export function handleApiError(error: unknown) {
  if (error instanceof UnauthorizedApiError) {
    return failResponse(error.errorCode, error.message, error.status);
  }

  if (error instanceof ApiError) {
    if (error.errorCode === "VALIDATION_ERROR" && error.errors) {
      return validationErrorResponse(error.message, error.errors, error.status);
    }

    return failResponse(error.errorCode, error.message, error.status);
  }

  const validationError = normalizeValidationError(error);
  if (validationError) {
    return validationErrorResponse(validationError.message, validationError.errors ?? [], validationError.status);
  }

  const dbError = normalizeDbError(error);
  if (dbError) {
    return failResponse(dbError.errorCode, dbError.message, dbError.status);
  }

  return serverErrorResponse();
}
