export interface QueryRequest<F> {
  page: number;
  size: number;
  filter: F;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  page: number;
  size: number;
}

// 分页参数类型
export interface PaginationParams {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}
