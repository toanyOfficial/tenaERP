export class ApiError extends Error {
  constructor(
    message: string,
    public errorCode: string,
    public status: number,
    public errors?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ValidationApiError extends ApiError {
  constructor(message: string, errors: Array<{ field: string; message: string }>) {
    super(message, "VALIDATION_ERROR", 400, errors);
    this.name = "ValidationApiError";
  }
}

export class UnauthorizedApiError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedApiError";
  }
}

export class ForbiddenApiError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenApiError";
  }
}

export class NotFoundApiError extends ApiError {
  constructor(message = "Not found") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundApiError";
  }
}
