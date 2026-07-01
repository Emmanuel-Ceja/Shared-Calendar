import { google } from "googleapis";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
    );

    auth.setCredentials({
      access_token: token.accessToken as string,
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Fetch all events from user's Google Calendar
    const response = await calendar.events.list({
      calendarId: "primary",
      maxResults: 250,
    });

    const googleEvents = response.data.items || [];
    let importedCount = 0;
    let skippedCount = 0;

    // For each Google Calendar event, check if it already exists in Supabase
    for (const event of googleEvents) {
      if (!event.summary || !event.start) continue;

      // Determine start and end times
      const startValue = event.start.dateTime || event.start.date;
      const endValue = event.end?.dateTime || event.end?.date || startValue;

      // Check if this event already exists in Supabase
      // Match by: title + start_time + created_by (to avoid duplicates)
      const { data: existing } = await supabase
        .from("events")
        .select("id")
        .eq("title", event.summary)
        .eq("start_time", startValue)
        .eq("created_by", token.email)
        .maybeSingle();

      if (existing) {
        skippedCount++;
        continue; // Already exists, skip
      }

      // Insert the event into Supabase
      const { error } = await supabase.from("events").insert({
        title: event.summary,
        start_time: startValue,
        end_time: endValue,
        created_by: token.email,
        is_date_night: false,
        google_event_id: event.id || null,
      });

      if (!error) {
        importedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedCount,
      skipped: skippedCount,
    });
  } catch (err: any) {
    console.error("Import Google Calendar error:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}