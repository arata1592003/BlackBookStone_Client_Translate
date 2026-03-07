import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/tai-khoan/ban-lam-viec";

  if (code) {
    // Tạo một phản hồi chuyển hướng trước
    const response = NextResponse.redirect(`${origin}${next}`);

    // Khởi tạo Supabase Client và truyền đối tượng response vào setAll
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            // Lấy cookie từ request
            const cookieHeader = request.headers.get('cookie') ?? '';
            // Parser đơn giản cho header
            return cookieHeader.split(';').map(c => {
              const [name, ...value] = c.trim().split('=');
              return { name, value: value.join('=') };
            });
          },
          setAll(cookiesToSet) {
            // Ghi đè cookie trực tiếp vào đối tượng response chúng ta sắp trả về
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      console.log("Auth Callback: Exchange thành công, đang redirect...");
      return response;
    }
    
    console.error("Auth Callback Error:", error.message);
  }

  return NextResponse.redirect(`${origin}/dang-nhap?error=Xác thực thất bại`);
}
