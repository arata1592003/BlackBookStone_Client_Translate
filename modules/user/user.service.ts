import { fetchUserProfileById, fetchUserTransactionStats } from "./user.repo";
import { UserProfile } from "./user.type";
import { fetchUserBookStats } from "../book/book.repo";
import { User } from "@supabase/supabase-js";
import { mapToUserProfile } from "./user.mapper";

export async function getUserProfileById(
  userId: string,
): Promise<UserProfile | null> {
  const entity = await fetchUserProfileById(userId);

  if (!entity) {
    return null;
  }

  return mapToUserProfile(entity);
}

export async function getUserStats(user: User) {
  if (!user) {
    return null;
  }

  const [transactionStats, bookStats] = await Promise.all([
    fetchUserTransactionStats(user.id),
    fetchUserBookStats(user.id),
  ]);

  console.log(transactionStats);

  return {
    ...transactionStats,
    ...bookStats,
  };
}
