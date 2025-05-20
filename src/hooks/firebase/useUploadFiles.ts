import { useMutation } from '@tanstack/react-query';

import { uploadFiles } from '@/lib/firebase/storage.firebase';

export const useUploadFiles = () => {
  return useMutation({ mutationFn: uploadFiles });
};
