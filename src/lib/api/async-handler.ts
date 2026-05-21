import { handleApiError } from "@/lib/api/error-handler";

export function withErrorHandler<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
) {
  return async (...args: TArgs) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
