"use server";

import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { updateUserProfile } from "@/modules/user/user.service";
import { UserProfile } from "@/modules/user/user.type";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUserProfileAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/dang-nhap");
  }

  const full_name = formData.get("full_name") as string;
  const avatar_url = formData.get("avatar_url") as string;

  if (!full_name) {
    return { error: "Họ và tên không được để trống." };
  }

  try {
    const updates: Partial<UserProfile> = {
      full_name,
      avatar_url: avatar_url || null,
    };

    await updateUserProfile(user.id, updates, supabase);

    revalidatePath("/tai-khoan/thong-tin");

    return { success: "Cập nhật thông tin thành công!" };
  } catch (error: unknown) {
    console.error("Lỗi khi cập nhật profile:", error);
    return {
      error:
        (error as Error).message || "Có lỗi xảy ra khi cập nhật thông tin.",
    };
  }
}
