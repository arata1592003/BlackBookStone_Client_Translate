import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { pathname } = request.nextUrl;

  // 1. Bỏ qua các tệp tĩnh và favicon
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth')
  ) {
    return response;
  }

  // 2. Khởi tạo Supabase Client cho Middleware
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

  // 3. Lấy thông tin user (getUser giúp làm mới token nếu cần)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // LUẬT 1: Bảo vệ vùng quản lý /tai-khoan/*
  if (!user && pathname.startsWith('/tai-khoan')) {
    const url = new URL('/dang-nhap', request.url);
    return NextResponse.redirect(url);
  }

  // LUẬT 2: Ngăn người dùng đã login quay lại trang đăng nhập/đăng ký
  if (user && (pathname === '/dang-nhap' || pathname === '/dang-ky')) {
    const url = new URL('/tai-khoan/ban-lam-viec', request.url);
    return NextResponse.redirect(url);
  }

  return response;
}
