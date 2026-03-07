import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => ({ name: c.name, value: c.name.includes('token') ? '***' : c.value }));

  return NextResponse.json({
    authenticated: !!user,
    user: user ? { id: user.id, email: user.email } : null,
    cookiesCount: allCookies.length,
    cookieNames: allCookies.map(c => c.name),
    env: {
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
    }
  });
}
