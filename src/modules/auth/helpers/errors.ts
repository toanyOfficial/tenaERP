import { clearSessionCookie } from "@/modules/auth/helpers/session-cookie";
import { unauthorizedResponse as baseUnauthorizedResponse } from "@/lib/api/response";
import { UnauthorizedApiError } from "@/lib/api/errors";

export class AuthError extends UnauthorizedApiError {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
  }
}

export function unauthorizedResponse(message = "Unauthorized") {
  const response = baseUnauthorizedResponse(message);
  clearSessionCookie(response);
  return response;
}
