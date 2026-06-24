import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { linkedEmail } = await req.json();

  // Check both directions before inserting, so clicking "Link" from
  // either person's account never creates a second, duplicate row for
  // the same relationship.
  const { data: existing } = await supabase
    .from("linked_users")
    .select("*")
    .or(
      `and(user_a.eq.${token.email},user_b.eq.${linkedEmail}),and(user_a.eq.${linkedEmail},user_b.eq.${token.email})`
    )
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ success: true, alreadyLinked: true });
  }

  const { data, error } = await supabase.from("linked_users").insert({
    user_a: token.email,
    user_b: linkedEmail,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}