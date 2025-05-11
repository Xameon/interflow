import { useQuery } from '@tanstack/react-query';

import { getCommunities } from '@/lib/api/communities.api';
import { QueryParams } from '@/models';

export const useCommunities = ({ options }: QueryParams) => {
  return useQuery({
    queryKey: ['communities'],
    queryFn: () => getCommunities().then(res => res.data),
    ...options,
  });
};
