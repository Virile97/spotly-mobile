import { useMutation } from '@tanstack/react-query';

import { uploadApi } from '@/features/upload/api/upload.api';

export function useUpload() {
  return useMutation({
    mutationFn: (uri: string) => uploadApi.uploadMedia(uri),
  });
}
