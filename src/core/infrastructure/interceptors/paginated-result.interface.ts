// paginated-result.interface.ts
export interface PaginatedResultIE<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
