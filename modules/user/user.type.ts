export type UserEntity = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null; // Thêm trường phone
  date_of_birth: string | null; // Thêm trường ngày sinh (ví dụ: 'YYYY-MM-DD')
  created_at: string;
  updated_at: string;
  is_admin: boolean | null;
};

export type UserProfile = {
  first_name: string | null;
  last_name: string | null;
  phone: string | null; // Thêm trường phone
  date_of_birth: string | null; // Thêm trường ngày sinh
  created_at: string;
  is_admin: boolean | null;
};
