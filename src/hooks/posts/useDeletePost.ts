import { useMutation } from '@tanstack/react-query';

import { deletePost } from '@/lib/api/posts';

export const useDeletePost = () => {
  return useMutation({
    mutationFn: deletePost,
  });
};
