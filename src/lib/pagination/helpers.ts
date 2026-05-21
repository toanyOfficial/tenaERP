import type { PaginationQuery, ParsedPagination, PaginationResult } from "@/lib/pagination/types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

function toPositiveInt(value: number | string | undefined, fallback: number) {
  const parsed = typeof value === "string" ? Number.parseInt(value, 10) : value;
  if (!Number.isInteger(parsed) || (parsed as number) <= 0) {
    return fallback;
  }

  return parsed as number;
}

export function parsePagination(query: PaginationQuery): ParsedPagination {
  const page = toPositiveInt(query.page, DEFAULT_PAGE);
  const limitRaw = toPositiveInt(query.limit, DEFAULT_LIMIT);
  const limit = Math.min(limitRaw, MAX_LIMIT);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function createPaginationResponse<T>(
  items: T[],
  totalCount: number,
  pagination: ParsedPagination,
): PaginationResult<T> {
  const hasMore = pagination.offset + items.length < totalCount;

  return {
    items,
    totalCount,
    hasMore,
    page: pagination.page,
    limit: pagination.limit,
  };
}
