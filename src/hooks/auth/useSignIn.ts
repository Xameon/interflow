import { signIn } from '@/lib/api/auth.api';
import { useMutation } from '@tanstack/react-query';

export const useSignIn = () => {
  return useMutation({
    mutationFn: signIn,
  });
};
