export type PaginationQuery = {
  page?: number | string;
  limit?: number | string;
};

export type ParsedPagination = {
  page: number;
  limit: number;
  offset: number;
};

export type PaginationResult<T> = {
  items: T[];
  totalCount: number;
  hasMore: boolean;
  page: number;
  limit: number;
};
