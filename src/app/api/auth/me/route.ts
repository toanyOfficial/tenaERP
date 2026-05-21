import { NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api";
import { getCurrentUser } from "@/modules/auth/helpers/auth";
import { AuthError, unauthorizedResponse } from "@/modules/auth/helpers/errors";
import { successResponse } from "@/lib/api/response";

export const GET = withErrorHandler(async () => {
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  return successResponse({ user });
});
