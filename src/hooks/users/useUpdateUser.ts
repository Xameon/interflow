import { useMutation } from '@tanstack/react-query';

import { updateUser } from '@/lib/api/users.api';
import { MutationOptions } from '@/models';
import { UpdateUserPayload } from '@/models/users.model';

export const useUpdateUser = (
  options?: MutationOptions<{ id: string }, UpdateUserPayload>,
) => {
  return useMutation({ mutationFn: updateUser, ...options });
};
