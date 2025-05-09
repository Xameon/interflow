import { useMutation } from '@tanstack/react-query';

import { updateComment } from '@/lib/api/posts';
import { MutationOptions } from '@/models';
import { UpdateCommentPayload } from '@/models/comments.model';

export const useUpdateComment = (
  options?: MutationOptions<{ message: string }, UpdateCommentPayload>,
) => {
  return useMutation({ mutationFn: updateComment, ...options });
};
