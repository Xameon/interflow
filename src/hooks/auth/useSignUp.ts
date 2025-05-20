import { useMutation } from '@tanstack/react-query';

import { signUp } from '@/lib/api/auth.api';

export const useSignUp = () => {
  return useMutation({
    mutationFn: signUp,
  });
};
