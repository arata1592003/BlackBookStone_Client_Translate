import { UserEntity, UserProfile } from "./user.type";

export const mapToUserProfile = (entity: UserEntity): UserProfile => {
  const fullName =
    `${entity.first_name ?? ""} ${entity.last_name ?? ""}`.trim();

  return {
    first_name: entity.first_name || "",
    last_name: entity.last_name || "",
    is_admin: entity.is_admin || null,
    created_at: entity.created_at,
  };
};
