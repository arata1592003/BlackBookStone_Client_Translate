import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("chapters")
      .select("content_raw, content_translated")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        contentRaw: data?.content_raw,
        contentTranslated: data?.content_translated,
      },
    });
  } catch (error: any) {
    console.error("API Error fetching chapter content:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
