import { NextResponse } from "next/server";
import { API_ERROR_CODE } from "@/lib/api/constants";
import type { ApiValidationErrorResponse } from "@/lib/api/types";

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function failResponse(errorCode: string, message: string, status = 400) {
  return NextResponse.json({ success: false, errorCode, message }, { status });
}

export function validationErrorResponse(
  message: string,
  errors: ApiValidationErrorResponse["errors"],
  status = 400,
) {
  return NextResponse.json(
    { success: false, errorCode: API_ERROR_CODE.VALIDATION_ERROR, message, errors },
    { status },
  );
}

export function unauthorizedResponse(message = "Unauthorized") {
  return failResponse(API_ERROR_CODE.UNAUTHORIZED, message, 401);
}

export function forbiddenResponse(message = "Forbidden") {
  return failResponse(API_ERROR_CODE.FORBIDDEN, message, 403);
}

export function notFoundResponse(message = "Not found") {
  return failResponse(API_ERROR_CODE.NOT_FOUND, message, 404);
}

export function serverErrorResponse(message = "Internal server error") {
  return failResponse(API_ERROR_CODE.SERVER_ERROR, message, 500);
}
