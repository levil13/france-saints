export interface StrapiResponseMulti<T> {
  data: Array<{attributes: T; id: number}>;
}

export interface StrapiResponseSingle<T> {
  data: {attributes: T; id: number};
}
