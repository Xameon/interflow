import { useQuery } from '@tanstack/react-query';

import { getPosts, GetPostsParams } from '@/lib/api/posts.api';
import { QueryParams } from '@/models';

export const usePosts = ({
  params,
  options,
}: QueryParams<GetPostsParams | undefined>) => {
  return useQuery({
    queryFn: () => getPosts(params).then(res => res.data),
    queryKey: ['posts', params],
    ...options,
  });
};
