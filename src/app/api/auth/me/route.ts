import { withErrorHandler } from "@/lib/api";
import { getCurrentUser } from "@/modules/auth/helpers/auth";
import { unauthorizedResponse } from "@/modules/auth/helpers/errors";
import { successResponse } from "@/lib/api/response";
import { getSensitiveVisibility } from "@/modules/auth/helpers/visibility";
import { getAuthorityLevel, normalizeAuthorityCode } from "@/modules/auth/helpers/authority";

export const GET = withErrorHandler(async () => {
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  return successResponse({
    user,
    authorityCode: user.authorityCode,
    normalizedAuthority: normalizeAuthorityCode(user.authorityCode),
    authorityLevel: getAuthorityLevel(user.authorityCode),
    visibility: getSensitiveVisibility(user),
  });
});
