import type { AuthSession, LoginPayload, RegisterPayload } from '@/features/auth/types/auth.types';

export type LoginRequest = LoginPayload;
export type RegisterRequest = RegisterPayload;
export type AuthResponse = AuthSession;
