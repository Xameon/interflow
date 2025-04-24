// ..................................................
// #region API Response

export type APIError<T = null> = {
  status: 'success' | 'failed' | 'error';
  message?: string;
  data: T;
};

// #endregion
// ..................................................

// ..................................................
// #region API Request Context

export type APIRequestContext<T> = {
  params: Promise<T>;
};

// #endregion
// ..................................................

// ..................................................
// #region Query Params

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

// #endregion
// ..................................................
