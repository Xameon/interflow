import { useMutation } from '@tanstack/react-query';

import { followUser } from '@/lib/api/users.api';
import { MutationOptions } from '@/models';

export const useFollowUser = (
  options?: MutationOptions<{ success: boolean }, string>,
) => {
  return useMutation({
    mutationFn: followUser,
    ...options,
  });
};
