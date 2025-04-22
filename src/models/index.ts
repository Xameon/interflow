type QueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  retry?: boolean;
};

export type QueryParams<T = undefined> = [T] extends [undefined]
  ? {
      options?: QueryOptions;
    }
  : {
      params: T;
      options?: QueryOptions;
    };
