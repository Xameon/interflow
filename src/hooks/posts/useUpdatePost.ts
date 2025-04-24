import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { updatePost } from '@/lib/api/posts';
import { UpdatePostPayload } from '@/models/posts.model';

export const useUpdatePost = (
  options?: UseMutationOptions<AxiosResponse, Error, UpdatePostPayload>,
) => {
  return useMutation({
    mutationFn: updatePost,
    ...options,
  });
};
