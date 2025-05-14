import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { likePost } from '@/lib/api/posts.api';

export const useLikePost = (
  options?: UseMutationOptions<void, Error, string, unknown>,
) => {
  return useMutation({ mutationFn: likePost, ...options });
};
