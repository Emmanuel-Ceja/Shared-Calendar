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
    // Added singleEvents and orderBy to properly expand multi-day recurring events
    const response = await calendar.events.list({
      calendarId: "primary",
      maxResults: 250,
      singleEvents: true,
      orderBy: "startTime",
    });

    const googleEvents = response.data.items || [];
    let importedCount = 0;
    let updatedCount = 0;

    // For each Google Calendar event, check if it already exists in Supabase
    for (const event of googleEvents) {
      if (!event.summary || !event.start) continue;

      // Determine start and end times
      const startValue = event.start.dateTime || event.start.date;
      const endValue = event.end?.dateTime || event.end?.date || startValue;

      // Check if this event already exists in Supabase
      // Match by google_event_id if available, fallback to title + start_time
      let query = supabase.from("events").select("id");
      
      if (event.id) {
        query = query.eq("google_event_id", event.id);
      } else {
        query = query.eq("title", event.summary).eq("start_time", startValue);
      }
      
      const { data: existing } = await query
        .eq("created_by", token.email)
        .maybeSingle();

      if (existing) {
        // If the event exists, UPDATE it instead of skipping. 
        // This ensures modified multi-day ranges are saved to Supabase.
        await supabase.from("events").update({
          title: event.summary,
          start_time: startValue,
          end_time: endValue,
        }).eq("id", existing.id);
        
        updatedCount++;
        continue; 
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
      skipped: updatedCount, 
    });
  } catch (err: any) {
    console.error("Import Google Calendar error:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}