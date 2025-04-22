import { useMutation } from '@tanstack/react-query';

import { signIn } from '@/lib/api/auth.api';

export const useSignIn = () => {
  return useMutation({
    mutationFn: signIn,
  });
};
