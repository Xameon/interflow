import { useQuery } from '@tanstack/react-query';

import { getUser } from '@/lib/api/users.api';
import { QueryParams } from '@/models';

export const useUser = ({ params, options }: QueryParams<{ id: string }>) => {
  return useQuery({
    queryFn: () => getUser(params.id).then(res => res.data),
    queryKey: ['users', params],
    ...options,
  });
};
