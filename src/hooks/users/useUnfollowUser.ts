import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { unfollowUser } from '@/lib/api/users.api';

export const useUnfollowUser = (
  options?: UseMutationOptions<void, Error, string, unknown>,
) => {
  return useMutation({ mutationFn: unfollowUser, ...options });
};
