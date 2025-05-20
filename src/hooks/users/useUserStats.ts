import { useQuery } from '@tanstack/react-query';

import { getUserStats } from '@/lib/api/users.api';
import { QueryParams } from '@/models';

export const useUserStats = ({
  params,
  options,
}: QueryParams<{ id: string }>) => {
  return useQuery({
    queryFn: () => getUserStats(params.id).then(res => res.data),
    queryKey: ['users', 'stats', params],
    ...options,
  });
};
