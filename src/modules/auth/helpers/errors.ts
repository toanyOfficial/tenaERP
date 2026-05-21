import { NextResponse } from "next/server";
import { AUTH_SESSION_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/modules/auth/constants";

export class AuthError extends Error {
  constructor(message = "Unauthorized", public status = 401) {
    super(message);
    this.name = "AuthError";
  }
}

export function unauthorizedResponse(message = "Unauthorized") {
  const response = NextResponse.json({ message }, { status: 401 });
  response.cookies.set({
    name: AUTH_SESSION_COOKIE_NAME,
    value: "",
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return response;
}
