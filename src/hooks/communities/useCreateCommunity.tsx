import { useMutation } from '@tanstack/react-query';

import { createCommunity } from '@/lib/api/communities.api';
import { MutationOptions } from '@/models';
import { CreateCommunityPayload } from '@/models/communities.model';

export const useCreateCommunity = (
  options?: MutationOptions<{ id: string }, CreateCommunityPayload>,
) => {
  return useMutation({
    mutationFn: createCommunity,
    ...options,
  });
};
