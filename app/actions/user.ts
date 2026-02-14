// app/actions/user.ts
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/user/server';
import { updateUserProfile } from '@/modules/user/user.service';
import { UserProfile } from '@/modules/user/user.type';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateUserProfileAction(prevState: { error?: string; success?: string; }, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/dang-nhap'); // Hoặc trả về lỗi nếu không có người dùng
  }

  const first_name = formData.get('first_name') as string;
  const last_name = formData.get('last_name') as string;
  const phone = formData.get('phone') as string;
  const date_of_birth = formData.get('date_of_birth') as string;

  // Basic validation (có thể mở rộng thêm)
  if (!first_name || !last_name) {
    return { error: 'Họ và tên không được để trống.' };
  }
  // Thêm validation cho phone, date_of_birth nếu cần

  try {
    const updates: Partial<UserProfile> = {
      first_name,
      last_name,
      phone: phone || null, // Chấp nhận null nếu để trống
      date_of_birth: date_of_birth || null, // Chấp nhận null nếu để trống
    };
    
    await updateUserProfile(user.id, updates);

    // Vô hiệu hóa cache cho userProfile để React Query fetch lại dữ liệu mới nhất
    // khi component re-render hoặc người dùng refresh.
    // revalidatePath('/') và revalidatePath('/tai-khoan/thong-tin')
    revalidatePath('/tai-khoan/thong-tin');

    return { success: 'Cập nhật thông tin thành công!' };

  } catch (error: unknown) {
    console.error("Lỗi khi cập nhật profile:", error);
    return { error: (error as Error).message || 'Có lỗi xảy ra khi cập nhật thông tin.' };
  }
}
