import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { linkedEmail } = await req.json();

  // save the link in supabase
  const { error } = await supabase.from("linked_users").insert({
    user_a: token.email,
    user_b: linkedEmail,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}