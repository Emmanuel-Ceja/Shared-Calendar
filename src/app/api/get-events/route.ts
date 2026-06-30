import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: links } = await supabase
    .from("linked_users")
    .select("*")
    .or(`user_a.eq.${token.email},user_b.eq.${token.email}`);

  const emails = [token.email];
  if (links && links.length > 0) {
    links.forEach((link: any) => {
      if (link.user_a !== token.email) emails.push(link.user_a);
      if (link.user_b !== token.email) emails.push(link.user_b);
    });
  }

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .in("created_by", emails);

  return NextResponse.json(events);
}