import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { dislikePost } from '@/lib/api/posts.api';

export const useDislikePost = (
  options?: UseMutationOptions<void, Error, string, unknown>,
) => {
  return useMutation({ mutationFn: dislikePost, ...options });
};
