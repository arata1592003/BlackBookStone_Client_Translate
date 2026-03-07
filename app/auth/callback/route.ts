import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
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
              // This can be ignored if middleware is handling session refresh
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Sau khi exchange thành công, cookie đã nằm trong cookieStore.
      // Chuyển hướng về trang đích (nên dùng URL tuyệt đối để an toàn trên Vercel)
      return NextResponse.redirect(new URL(next, request.url));
    }
    
    console.error("Auth Callback Error:", error.message);
  }

  // Nếu có lỗi, về trang đăng nhập kèm lỗi
  return NextResponse.redirect(new URL(`/dang-nhap?error=Xác thực thất bại`, request.url));
}
