import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

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
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const isLocalEnv = origin.includes('localhost');
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        // Trên Vercel, đôi khi origin trả về dạng IP hoặc nội bộ, 
        // nên dùng URL tương đối hoặc SITE_URL nếu có
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
    
    console.error("OAuth Exchange Error:", error.message);
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/dang-nhap?error=Xác thực thất bại`);
}
