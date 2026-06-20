import { google } from "googleapis";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const event = await req.json();

  // Save to Supabase
  const { data, error } = await supabase.from("events").insert({
    title: event.summary,
    start_time: event.start.dateTime,
    end_time: event.end.dateTime,
    created_by: token.email,
    linked_to: "",
  });

  console.log("Supabase data:", data);
  console.log("Supabase error:", error);

  // Save to Google Calendar
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
  );

  auth.setCredentials({
    access_token: token.accessToken as string,
  });

  const calendar = google.calendar({ version: "v3", auth });

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });

  return NextResponse.json(response.data);
}