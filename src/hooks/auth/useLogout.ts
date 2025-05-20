import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { logout } from '@/lib/api/auth.api';

export const useLogout = (
  options?: UseMutationOptions<void, Error, void, unknown>,
) => {
  return useMutation({ mutationFn: logout, ...options });
};
