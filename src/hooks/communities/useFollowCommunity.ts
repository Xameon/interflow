import { useMutation } from '@tanstack/react-query';

import {
  followCommunity,
  FollowCommunityResponse,
} from '@/lib/api/communities.api';
import { MutationOptions } from '@/models';

export const useFollowCommunity = (
  options?: MutationOptions<FollowCommunityResponse, string>,
) => {
  return useMutation({
    mutationFn: followCommunity,
    ...options,
  });
};
