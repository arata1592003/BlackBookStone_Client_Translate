export type UserEntity = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean | null;
};

export type User = {
  id: string;
  fullName: string;
  isAdmin: boolean;
};
