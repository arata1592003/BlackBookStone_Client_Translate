import { UserEntity, UserProfile } from "./user.type";

export const mapToUserProfile = (entity: UserEntity): UserProfile => {
  return {
    full_name: entity.full_name || null,
    avatar_url: entity.avatar_url || null,
    created_at: entity.created_at,
  };
};
