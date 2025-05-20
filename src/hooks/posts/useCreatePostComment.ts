import { useMutation } from '@tanstack/react-query';

import { createComment } from '@/lib/api/posts.api';
import { MutationOptions } from '@/models';
import { CreateCommentPayload } from '@/models/comments.model';

export const useCreatePostComment = (
  options?: MutationOptions<{ id: string }, CreateCommentPayload>,
) => {
  return useMutation({
    mutationFn: createComment,
    ...options,
  });
};
