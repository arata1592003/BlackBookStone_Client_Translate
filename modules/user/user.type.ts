export type UserEntity = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean | null;
};

export type UserProfile = {
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  is_admin: boolean | null;
};
