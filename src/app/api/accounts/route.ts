import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { validateQuery } from "@/lib/validation";
import { requireAuth } from "@/modules/auth/helpers/auth";
import { listAccountsService } from "@/modules/account/services/list-accounts";
import { listAccountsQuerySchema } from "@/modules/account/validators/list-accounts";

export const GET = withErrorHandler(async (request: Request) => {
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());
  const parsed = validateQuery(listAccountsQuerySchema, query);

  if (!parsed.success) {
    return validationErrorResponse(parsed.message, parsed.errors);
  }

  const user = await requireAuth();
  const result = await listAccountsService(parsed.data, user);

  return successResponse({
    ...result,
    visibility: {
      canDecryptCredential: user.authorityCode === "0",
      canCopyCredential: user.authorityCode === "0",
    },
  });
});
