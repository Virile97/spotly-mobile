export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
  },
  profiles: {
    me: '/profiles/me',
    imageUploadUrl: '/profiles/me/image-upload-url',
    image: '/profiles/me/image',
    interests: '/profiles/me/interests',
    byUsername: (username: string) => `/profiles/${encodeURIComponent(username)}`,
    share: (username: string) => `/profiles/${encodeURIComponent(username)}/share`,
  },
  interests: '/interests',
} as const
