import { useQuery } from '@tanstack/react-query';

import { getPosts } from '@/lib/api/posts';
import { QueryParams } from '@/models';

export const usePosts = ({ options }: QueryParams) => {
  return useQuery({
    queryFn: () => getPosts().then(res => res.data),
    queryKey: ['posts'],
    ...options,
  });
};
