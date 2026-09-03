import { apiClient } from '@/core/api/client';
import type { AuthUser } from '@/features/auth/types/auth.types';

export interface ProfileStats {
  postCount: number;
  followerCount: number;
  followingCount: number;
}

export interface UserProfile extends AuthUser {
  bio: string | null;
  stats: ProfileStats;
}

export interface UpdateProfilePayload {
  username?: string;
  bio?: string;
  avatarUrl?: string;
}

export const profileApi = {
  getProfile: (userId: string) =>
    apiClient.get<UserProfile>(`/users/${userId}`).then((res) => res.data),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient.patch<UserProfile>('/users/me', payload).then((res) => res.data),
};
