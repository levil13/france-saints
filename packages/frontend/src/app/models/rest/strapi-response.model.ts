export interface StrapiResponseMulti<T> {
  data: Array<{ attributes: T, id: number }>;
  meta: { pagination: StrapiPagination };
}

export interface StrapiResponseSingle<T> {
  data: { attributes: T, id: number };
  meta: { pagination: StrapiPagination };
}

export interface StrapiPagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}
