export interface QueryRequest<F> {
  page: number;
  size: number;
  filter: F; /* filter可以传null，但不能少了这个参数 */
}

export interface PageResult<T> {
  records: T[];
  total: number;
  page: number;
  size: number;
}
