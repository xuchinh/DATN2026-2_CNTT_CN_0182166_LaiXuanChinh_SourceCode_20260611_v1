export type TypePagination = {
  current: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type TypePaginationRequest = Pick<TypePagination, "current" | "pageSize">;

export type TypePageData<T = unknown> = {
  data: T[];
  meta: TypePagination;
};
