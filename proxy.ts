import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() sẽ tự động refresh token nếu nó hết hạn
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 1. Nếu chưa đăng nhập mà vào /tai-khoan/* -> Về trang đăng nhập
  if (!user && pathname.startsWith('/tai-khoan')) {
    return NextResponse.redirect(new URL('/dang-nhap', request.url));
  }

  // 2. Nếu đã đăng nhập mà vào trang đăng nhập/đăng ký -> Về Bàn làm việc
  if (user && (pathname === '/dang-nhap' || pathname === '/dang-ky')) {
    return NextResponse.redirect(new URL('/tai-khoan/ban-lam-viec', request.url));
  }

  return response;
}
