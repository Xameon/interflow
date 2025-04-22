import { auth } from '@/lib/api/auth.api';
import { QueryParams } from '@/models';
import { useQuery } from '@tanstack/react-query';

export const useAuth = ({ options }: QueryParams) => {
  return useQuery({
    queryFn: auth,
    queryKey: ['auth'],
    ...options,
  });
};
