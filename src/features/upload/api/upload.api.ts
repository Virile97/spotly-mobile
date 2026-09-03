import { apiClient } from '@/core/api/client';

export const uploadApi = {
  uploadMedia: (uri: string) => {
    const formData = new FormData();
    const filename = uri.split('/').pop() ?? 'upload.jpg';
    formData.append('file', { uri, name: filename, type: 'image/jpeg' } as unknown as Blob);

    return apiClient
      .post<{ url: string }>('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data.url);
  },
};
