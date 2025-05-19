import { useQuery } from '@tanstack/react-query';

import { getCategories } from '@/lib/api/communities.api';
import { QueryParams } from '@/models';

export const useCategories = ({ options }: QueryParams) => {
  return useQuery({
    queryKey: ['communities', 'categories'],
    queryFn: () => getCategories().then(res => res.data),
    ...options,
  });
};
