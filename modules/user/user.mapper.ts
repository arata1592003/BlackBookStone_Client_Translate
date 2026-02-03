import { UserEntity, UserProfile } from "./user.type";

export const mapToUserProfile = (entity: UserEntity): UserProfile => {
  return {
    first_name: entity.first_name || null, // Có thể là null
    last_name: entity.last_name || null, // Có thể là null
    phone: entity.phone || null, // Ánh xạ trường phone
    date_of_birth: entity.date_of_birth || null, // Ánh xạ trường date_of_birth
    is_admin: entity.is_admin || null,
    created_at: entity.created_at,
  };
};
