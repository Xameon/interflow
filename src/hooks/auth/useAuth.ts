import { useQuery } from '@tanstack/react-query';

import { auth } from '@/lib/api/auth.api';
import { QueryParams } from '@/models';

export const useAuth = ({ options }: QueryParams) => {
  return useQuery({
    queryFn: auth,
    queryKey: ['auth'],
    ...options,
  });
};
