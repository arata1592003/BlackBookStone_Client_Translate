import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  // "next" là trang muốn quay lại sau khi login, mặc định là bàn làm việc
  const next = searchParams.get("next") ?? "/tai-khoan/ban-lam-viec";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Đây là lỗi bình thường nếu gọi từ Server Component
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Xác định URL cuối cùng để redirect
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
      const redirectUrl = `${baseUrl}${next}`;
      
      return NextResponse.redirect(redirectUrl);
    }
    
    console.error("Exchange Error:", error.message);
  }

  // Về trang đăng nhập nếu thất bại
  const errorBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  return NextResponse.redirect(`${errorBaseUrl}/dang-nhap?error=Xác thực thất bại`);
}
