"use server";

import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Lỗi đăng nhập:", error.message);
    redirect(`/dang-nhap?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/dang-nhap");
}
