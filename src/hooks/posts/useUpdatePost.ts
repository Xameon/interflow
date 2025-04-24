import { useMutation } from '@tanstack/react-query';

import { updatePost } from '@/lib/api/posts';

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: updatePost,
  });
};
