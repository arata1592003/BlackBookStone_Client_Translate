import type { User } from '@supabase/supabase-js';
import { UserProfile } from '../user/user.type';

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  userProfile: UserProfile;
};