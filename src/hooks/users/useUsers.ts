import { useQuery } from '@tanstack/react-query';

import { getUsers, GetUsersParams } from '@/lib/api/users.api';
import { QueryParams } from '@/models';

export const useUsers = ({ params, options }: QueryParams<GetUsersParams>) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params).then(res => res.data),
    ...options,
  });
};
