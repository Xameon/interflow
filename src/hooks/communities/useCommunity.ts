import { useQuery } from '@tanstack/react-query';

import { getCommunity } from '@/lib/api/communities.api';
import { QueryParams } from '@/models';

export const useCommunity = ({
  params,
  options,
}: QueryParams<{ communityId: string }>) => {
  return useQuery({
    queryKey: ['communities', params],
    queryFn: () => getCommunity(params.communityId).then(res => res.data),
    ...options,
  });
};
