import type { NextResponse } from "next/server";
import { AUTH_COOKIE_OPTIONS, AUTH_SESSION_COOKIE_NAME } from "@/modules/auth/constants";

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: AUTH_SESSION_COOKIE_NAME,
    value: token,
    ...AUTH_COOKIE_OPTIONS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_SESSION_COOKIE_NAME,
    value: "",
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
  });
}
