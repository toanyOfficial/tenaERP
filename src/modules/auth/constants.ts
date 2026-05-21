export const AUTH_SESSION_COOKIE_NAME = "tena_session";
export const AUTH_SESSION_DURATION_SECONDS = 60 * 60 * 10;
export const AUTH_INVALID_CREDENTIALS_MESSAGE = "사번 또는 비밀번호가 올바르지 않습니다.";

export const AUTH_MODULE = "auth";

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: AUTH_SESSION_DURATION_SECONDS,
};
