import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // 1. Bỏ qua các tệp tĩnh và favicon
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return response;
  }

  // 2. Khởi tạo Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 3. Lấy thông tin session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // LUẬT 1: Bảo vệ vùng quản lý /tai-khoan/*
  if (!session && pathname.startsWith('/tai-khoan')) {
    return NextResponse.redirect(new URL('/dang-nhap', request.url));
  }

  // LUẬT 2: Ngăn người dùng đã login quay lại trang đăng nhập/đăng ký
  if (session && (pathname === '/dang-nhap' || pathname === '/dang-ky')) {
    return NextResponse.redirect(new URL('/tai-khoan/ban-lam-viec', request.url));
  }

  return response;
}
