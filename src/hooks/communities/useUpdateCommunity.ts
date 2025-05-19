import { useMutation } from '@tanstack/react-query';

import { updateCommunity } from '@/lib/api/communities.api';
import { MutationOptions } from '@/models';
import { UpdateCommunityPayload } from '@/models/communities.model';

export const useUpdateCommunity = (
  options?: MutationOptions<{ message: string }, UpdateCommunityPayload>,
) => {
  return useMutation({ mutationFn: updateCommunity, ...options });
};
