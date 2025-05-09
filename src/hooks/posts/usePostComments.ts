import { useQuery } from '@tanstack/react-query';

import { getComments } from '@/lib/api/posts';
import { QueryParams } from '@/models';

export const usePostComments = ({
  params,
  options,
}: QueryParams<{ postId: string }>) => {
  return useQuery({
    queryFn: () => getComments(params.postId).then(res => res.data),
    queryKey: ['posts', 'comments', params],
    ...options,
  });
};
