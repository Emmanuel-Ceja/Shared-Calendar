import { google } from "googleapis";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id, google_event_id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing event id" }, { status: 400 });
  }

  // Server-side ownership check. The UI already hides the Delete button
  // for non-owners, but this is the actual enforcement -- without it,
  // anyone could call this route directly and delete someone else's event.
  const { data: existingEvent, error: fetchError } = await supabase
    .from("events")
    .select("created_by")
    .eq("id", id)
    .single();

  if (fetchError || !existingEvent) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (existingEvent.created_by !== token.email) {
    return NextResponse.json(
      { error: "Only the creator of this event can delete it" },
      { status: 403 }
    );
  }

  // Delete from Google Calendar. Since only the creator reaches this
  // point now, their own access token always matches the calendar this
  // event actually lives in.
  if (google_event_id) {
    try {
      const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID!,
        process.env.GOOGLE_CLIENT_SECRET!,
      );

      auth.setCredentials({
        access_token: token.accessToken as string,
      });

      const calendar = google.calendar({ version: "v3", auth });

      await calendar.events.delete({
        calendarId: "primary",
        eventId: google_event_id,
      });
    } catch (err: any) {
      // If Google's copy is already gone for some reason, don't let
      // that block removing it from Supabase too.
      console.error("Google Calendar delete error:", err.message);
    }
  }

  // Delete from Supabase, which is what makes it disappear from both
  // partners' FullCalendar views.
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    console.error("Supabase delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}