import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("linked_users")
    .select("*")
    .or(`user_a.eq.${token.email},user_b.eq.${token.email}`)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ linked: false });
  }

  // Whichever side of the row isn't "me" is the partner's email.
  const partnerEmail = data.user_a === token.email ? data.user_b : data.user_a;

  return NextResponse.json({ linked: true, partnerEmail, linkRowId: data.id });
}