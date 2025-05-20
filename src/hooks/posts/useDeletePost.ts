import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { deletePost } from '@/lib/api/posts.api';

export const useDeletePost = (
  options?: UseMutationOptions<void, Error, string, unknown>,
) => {
  return useMutation({
    mutationFn: deletePost,
    ...options,
  });
};
