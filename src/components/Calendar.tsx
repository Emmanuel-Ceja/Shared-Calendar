"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TimePickerModal from "@/components/TimePickerModal";
import EndTimePickerModal from "@/components/EndTimePickerModal";
import EventTitleModal from "./EventTitleModal";
import EventDetailModal from "./EventDetailModal";
import { supabase } from "@/lib/supabase";

// Hardcoded since this app is just for two specific people, not a
// general audience -- no need for a database column to track this.
const YOUR_EMAIL = "ceja.emmanuelec1@gmail.com";
const HER_EMAIL = "her-email@gmail.com"; // replace with her actual email

export default function Calendar() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  let [isOpen, setIsOpen] = useState(false);
  let [isOpenEndTime, setIsOpenEndTime] = useState(false);
  const [clickedDate, setClickedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [isDateNight, setIsDateNight] = useState(false);
  let [isOpenEventTitle, setIsOpenEventTitle] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  let [isOpenDetail, setIsOpenDetail] = useState(false);
  const [clickedEvent, setClickedEvent] = useState("");

  useEffect(() => {
    fetchEvents();

    // Subscribe to any change (insert, update, delete) on the events
    // table. This is what makes a partner's new/deleted event show up
    // here without needing to manually refresh the page.
    const channel = supabase
      .channel("events-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    // Cleanup: stop listening when this component unmounts, so we don't
    // pile up duplicate subscriptions every time the page re-renders.
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleTimePickerSubmit = (startTimeVal: string, endTime: string, isAllDay: boolean, isDate: boolean, endDate?: string) => {
    if (isAllDay) {
      handleCreateAllDayEvent(isDate, endDate);
    } else {
      // Store the start time and is date flag, then open EndTimePickerModal
      setStartTime(startTimeVal);
      setIsDateNight(isDate);
      toggleModalEnd();
    }
  }

  const toggleModalEnd = () => {
    setIsOpen(false);
    setIsOpenEndTime(true);
  }

  async function handleCreateEvent(startTime: string, endTime: string, isDate: boolean) {
    if (!clickedDate) return;

    const event = {
      summary: eventTitle || "New Event",
      start: { dateTime: `${clickedDate}T${startTime}-07:00` },
      end: { dateTime: `${clickedDate}T${endTime}-07:00` },
      is_date_night: isDate,
    };

    const response = await fetch("/api/create-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    if (response.ok) {
      alert("Event created!");
      fetchEvents();
      resetEventState();
    } else {
      alert("Failed to create event.");
    }
  }

  async function handleCreateAllDayEvent(isDate: boolean, endDate?: string) {
    if (!clickedDate) return;

    // If endDate provided (multi-day), use it; otherwise, use the same day
    const endDateForEvent = endDate || clickedDate;

    // Google's "end" date is exclusive for all-day events, so add 1 day
    const nextDay = new Date(endDateForEvent);
    nextDay.setDate(nextDay.getDate() + 1);
    const endDateString = nextDay.toISOString().split("T")[0];

    const event = {
      summary: eventTitle || "New Event",
      start: { date: clickedDate },
      end: { date: endDateString },
      is_date_night: isDate,
    };

    const response = await fetch("/api/create-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    if (response.ok) {
      alert("Event created!");
      fetchEvents();
      resetEventState();
    } else {
      alert("Failed to create event.");
    }
  }

  // Called from EventDetailModal's Delete button. Removes the event from
  // Supabase (so it disappears for both linked partners) and from the
  // signed-in user's own Google Calendar.
  async function handleDeleteEvent(id: string, googleEventId: string | null) {
    const response = await fetch("/api/delete-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, google_event_id: googleEventId }),
    });

    if (response.ok) {
      alert("Event deleted!");
      fetchEvents();
      setIsOpenDetail(false);
      setClickedEvent("");
    } else {
      alert("Failed to delete event.");
    }
  }

  // Clears out any leftover data from a cancelled or completed attempt
  // so the next time the user opens the flow, it starts fresh.
  function resetEventState() {
    setClickedDate("");
    setEventTitle("");
    setStartTime("");
    setIsDateNight(false);
    setIsOpen(false);
    setIsOpenEndTime(false);
    setIsOpenEventTitle(false);
  }

  async function dateClick(info: any) {
    setIsOpenEventTitle(true);
    // In month view, info.dateStr is just "YYYY-MM-DD".
    // In week/time-grid view, info.dateStr already includes a time
    // and offset (e.g. "2026-06-23T01:30:00-07:00"). Splitting on "T"
    // keeps only the date portion either way, so it's always a clean
    // "YYYY-MM-DD" before startTime/endTime get appended later.
    const justTheDate = info.dateStr.split("T")[0];
    setClickedDate(justTheDate);
  }

  async function fetchEvents() {
    const response = await fetch("/api/get-events");
    const data = await response.json();
    const formatted = data.map((e: any) => {
      let color = "#888888";
      if (e.created_by === YOUR_EMAIL) {
        color = "#3B82F6";
      } else if (e.created_by === HER_EMAIL) {
        color = "#EC4899";
      }
      if (e.is_date_night) {
        color = "#8B5CF6";
      }

      // Detect all-day events: start_time is just a date (YYYY-MM-DD)
      const isAllDay = /^\d{4}-\d{2}-\d{2}$/.test(e.start_time);

      // For FullCalendar, ensure proper date/time format
      let start = e.start_time;
      let end = e.end_time;

      // If it's an all-day event, FullCalendar needs the dates in YYYY-MM-DD format
      // and the end date should be exclusive (day after last day of event)
      if (isAllDay) {
        // Dates are already in correct format from Supabase
        // FullCalendar will properly span them as long as allDay is true
        start = e.start_time; // e.g., "2026-07-01"
        end = e.end_time;     // e.g., "2026-07-09" (exclusive end)
      }

      return {
        title: e.title,
        start: start,
        end: end,
        allDay: isAllDay,
        color: color,
        extendedProps: {
          id: e.id,
          google_event_id: e.google_event_id,
          created_by: e.created_by,
        },
      };
    });
    setEvents(formatted);
  }

  async function eventClickDetail(info: any) {
    setIsOpenDetail(true);
    setClickedEvent(info.event);
  }

  return (
    <div style={{ width: "100%", height: "calc(100vh - 50px)", padding: "10px", boxSizing: "border-box" }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        dateClick={dateClick}
        eventClick={eventClickDetail}
        events={events}
        height="100%"
        headerToolbar={{
          right: 'dayGridMonth,timeGridWeek,prev,next,today',
          center: 'title',
          left: ''
        }}
      />
      <EventDetailModal
        isOpen={isOpenDetail}
        setIsOpen={setIsOpenDetail}
        event={clickedEvent}
        onDelete={handleDeleteEvent}
        currentUserEmail={session?.user?.email ?? ""}/>
      <EventTitleModal
        isOpen={isOpenEventTitle}
        setIsOpen={setIsOpenEventTitle}
        onSubmit={setEventTitle}
        onContinue={() => setIsOpen(true)}
        onCancel={resetEventState}/>
      <TimePickerModal 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={handleTimePickerSubmit}
        onToggleEnd={toggleModalEnd}
        dateStr={clickedDate}/>
      <EndTimePickerModal
        isOpen={isOpenEndTime}
        setIsOpen={setIsOpenEndTime}
        onSubmit={handleCreateEvent}
        onCancel={resetEventState}
        startTime={startTime}
        isDate={isDateNight}/>
    </div>
  );
}