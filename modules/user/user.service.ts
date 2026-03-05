import { fetchUserProfileById, fetchUserTransactionStats, updateUserProfileInDB } from "./user.repo";
import { UserProfile } from "./user.type";
import { fetchUserBookStats } from "../book/book.repo";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { mapToUserProfile } from "./user.mapper";

export async function getUserProfileById(
  userId: string,
  supabase?: SupabaseClient,
): Promise<UserProfile | null> {
  const entity = await fetchUserProfileById(userId, supabase);

  if (!entity) {
    return null;
  }

  return mapToUserProfile(entity);
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>,
  supabase?: SupabaseClient,
): Promise<UserProfile | null> {
  const updatedEntity = await updateUserProfileInDB(userId, updates, supabase);
  if (!updatedEntity) {
    return null;
  }
  return mapToUserProfile(updatedEntity);
}

export async function getUserStats(user: User, supabase?: SupabaseClient) {
  if (!user) {
    return null;
  }

  const [transactionStats, bookStats] = await Promise.all([
    fetchUserTransactionStats(user.id, supabase),
    fetchUserBookStats(user.id, supabase),
  ]);

  return {
    ...transactionStats,
    ...bookStats,
  };
}
