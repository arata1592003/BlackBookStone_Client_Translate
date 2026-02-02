// app/actions/auth.ts
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/user/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Có thể trả về lỗi hoặc chuyển hướng đến trang lỗi
    console.error("Lỗi đăng nhập:", error.message);
    redirect(`/dang-nhap?error=${encodeURIComponent(error.message)}`);
  }

  // Nếu thành công, Supabase Auth Helpers đã tự động thiết lập cookies.
  // Chuyển hướng đến trang chính hoặc trang người dùng.
  redirect('/');
}

// Bạn có thể thêm hàm logout tại đây
export async function logout() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/dang-nhap'); // Chuyển hướng về trang đăng nhập sau khi đăng xuất
}
