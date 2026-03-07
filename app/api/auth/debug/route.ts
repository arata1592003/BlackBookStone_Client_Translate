import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    const cookieStore = await cookies();
    const allCookies = (await cookieStore).getAll().map(c => ({ 
      name: c.name, 
      value: c.name.includes('token') ? '***' : c.value 
    }));

    // Trích xuất project id từ URL để đối soát
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const projectIdFromUrl = supabaseUrl.match(/https:\/\/(.*?)\.supabase\.co/)?.[1] || "unknown";

    return NextResponse.json({
      authenticated: !!user,
      projectIdInConfig: projectIdFromUrl,
      user: user ? { id: user.id, email: user.email } : null,
      session: !!session,
      errors: {
        user: userError?.message,
        session: sessionError?.message
      },
      cookies: allCookies,
      env: {
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
        supabaseUrlSet: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKeySet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
