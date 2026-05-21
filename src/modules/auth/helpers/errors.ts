import { clearSessionCookie } from "@/modules/auth/helpers/session-cookie";
import { unauthorizedResponse as baseUnauthorizedResponse } from "@/lib/api/response";

export class AuthError extends Error {
  constructor(message = "Unauthorized", public status = 401) {
    super(message);
    this.name = "AuthError";
  }
}

export function unauthorizedResponse(message = "Unauthorized") {
  const response = baseUnauthorizedResponse(message);
  clearSessionCookie(response);
  return response;
}
