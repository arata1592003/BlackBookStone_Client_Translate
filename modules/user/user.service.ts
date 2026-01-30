import { supabaseClient } from "@/lib/supabase/client";
import { mapToUser } from "./user.mapper";
import { fetchUserById, fetchUserTransactionStats } from "./user.repo";
import { User } from "./user.type";
import { fetchUserBookStats } from "../book/book.repo";

export async function getUserById(userId: string): Promise<User | null> {
  const entity = await fetchUserById(userId);

  if (!entity) {
    return null;
  }

  return mapToUser(entity);
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

  if (sessionError) {
    console.error("Error getting session:", sessionError.message);
    return null;
  }

  if (!session || !session.user) {
    return null;
  }

  const entity = await fetchUserById(session.user.id);

  if (!entity) {
    console.warn(`User with ID ${session.user.id} found in auth session but not in public.users table.`);
    return null;
  }

  return mapToUser(entity);
}

export async function getUserStats() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const [transactionStats, bookStats] = await Promise.all([
    fetchUserTransactionStats(user.id),
    fetchUserBookStats(user.id)
  ]);

  return {
    ...transactionStats,
    ...bookStats
  };
}
