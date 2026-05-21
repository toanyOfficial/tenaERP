import { NextResponse } from "next/server";
import {
  AUTH_INVALID_CREDENTIALS_MESSAGE,
  AUTH_SESSION_COOKIE_NAME,
  AUTH_SESSION_DURATION_SECONDS,
} from "@/modules/auth/constants";
import { authenticateEmployee } from "@/modules/auth/services/login";
import { createSessionToken } from "@/modules/auth/utils/session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { employeeNo?: string; password?: string };
    const employeeNo = body.employeeNo?.trim();
    const password = body.password;

    if (!employeeNo || !password) {
      return NextResponse.json({ message: AUTH_INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
    }

    const user = await authenticateEmployee(employeeNo, password);
    const token = createSessionToken(user.id, user.employeeNo);

    const response = NextResponse.json({ user }, { status: 200 });
    response.cookies.set({
      name: AUTH_SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_SESSION_DURATION_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json({ message: AUTH_INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
  }
}
