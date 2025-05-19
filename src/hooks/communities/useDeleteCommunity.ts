import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { deleteCommunity } from '@/lib/api/communities.api';

export const useDeleteCommunity = (
  options?: UseMutationOptions<void, Error, string, unknown>,
) => {
  return useMutation({ mutationFn: deleteCommunity, ...options });
};
