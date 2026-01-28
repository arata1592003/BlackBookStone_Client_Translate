import { UserEntity, User } from "./user.type";

export const mapToUser = (entity: UserEntity): User => {
  const fullName = `${entity.first_name ?? ""} ${entity.last_name ?? ""}`.trim();

  return {
    id: entity.id,
    fullName: fullName || "Unnamed User", // Fallback for users with no name
    isAdmin: entity.is_admin ?? false,
  };
};
