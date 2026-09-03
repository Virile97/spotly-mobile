export interface PostAuthor {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface Post {
  id: string;
  author: PostAuthor;
  caption: string;
  mediaUrls: string[];
  placeId: string | null;
  reactionCount: number;
  commentCount: number;
  createdAt: string;
}

export interface CreatePostPayload {
  caption: string;
  mediaUrls: string[];
  placeId?: string;
}

export interface UpdatePostPayload {
  caption?: string;
}
