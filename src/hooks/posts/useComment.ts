import { useQuery } from '@tanstack/react-query';

import { getComment, GetCommentParams } from '@/lib/api/posts';
import { QueryParams } from '@/models';

export const useComment = ({
  params,
  options,
}: QueryParams<GetCommentParams>) => {
  return useQuery({
    queryKey: ['posts', 'comments', params],
    queryFn: () => getComment(params).then(res => res.data),
    ...options,
  });
};
