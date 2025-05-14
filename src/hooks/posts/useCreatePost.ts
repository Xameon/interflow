import { useMutation } from '@tanstack/react-query';

import { createPost } from '@/lib/api/posts.api';

export const useCreatePost = () => {
  return useMutation({
    mutationFn: createPost,
  });
};
