export type UserEntity = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProfile = {
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};
