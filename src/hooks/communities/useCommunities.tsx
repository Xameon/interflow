import { useQuery } from '@tanstack/react-query';

import {
  getCommunities,
  GetCommunitiesParams,
} from '@/lib/api/communities.api';
import { QueryParams } from '@/models';

export const useCommunities = ({
  params,
  options,
}: QueryParams<GetCommunitiesParams>) => {
  return useQuery({
    queryKey: ['communities'],
    queryFn: () => getCommunities(params).then(res => res.data),
    ...options,
  });
};
