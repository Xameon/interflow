// ..................................................
// #region API Response

import { UseMutationOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

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
  refetchInterval?: number;
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

// ..................................................
// #region Mutation Options

/**
 * `T` = Response Type
 *
 * `D` = Params Type
 */

export type MutationOptions<T = void, D = undefined> = UseMutationOptions<
  AxiosResponse<T>,
  Error,
  D,
  unknown
>;

// #endregion
// ..................................................
