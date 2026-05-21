export type PaginationInput = {
  page?: number;
  limit?: number;
};

export type Pagination = {
  page: number;
  limit: number;
  offset: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function toPagination(input: PaginationInput): Pagination {
  const page = Number.isInteger(input.page) && (input.page as number) > 0 ? (input.page as number) : DEFAULT_PAGE;
  const limitRaw = Number.isInteger(input.limit) && (input.limit as number) > 0 ? (input.limit as number) : DEFAULT_LIMIT;
  const limit = Math.min(limitRaw, MAX_LIMIT);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}
