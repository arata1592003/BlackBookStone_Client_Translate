// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Tạo một client Supabase cho phía trình duyệt (Client Components)
// Nó sẽ tự động đọc session từ cookies và gửi kèm token trong mỗi yêu cầu.
export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
