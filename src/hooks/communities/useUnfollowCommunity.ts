import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { unfollowCommunity } from '@/lib/api/communities.api';

export const useUnfollowCommunity = (
  options?: UseMutationOptions<void, Error, string, unknown>,
) => {
  return useMutation({
    mutationFn: unfollowCommunity,
    ...options,
  });
};
