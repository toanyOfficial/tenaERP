import type { API_ERROR_CODE } from "@/lib/api/constants";

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiFailResponse = {
  success: false;
  errorCode: (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE] | string;
  message: string;
};

export type ApiValidationErrorResponse = ApiFailResponse & {
  errors: Array<{
    field: string;
    message: string;
  }>;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailResponse | ApiValidationErrorResponse;
