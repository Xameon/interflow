import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { deleteComment } from '@/lib/api/posts';
import { DeleteCommentPayload } from '@/models/comments.model';

export const useDeleteComment = (
  options?: UseMutationOptions<void, Error, DeleteCommentPayload, unknown>,
) => {
  return useMutation({ mutationFn: deleteComment, ...options });
};
