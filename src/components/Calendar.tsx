"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TimePickerModal from "@/components/TimePickerModal";
import EventTitleModal from "./EventTitleModal";
import EventDetailModal from "./EventDetailModal";
import { supabase } from "@/lib/supabase";

const MY_EMAIL = process.env.NEXT_PUBLIC_MY_EMAIL || "";
const HER_EMAIL = process.env.NEXT_PUBLIC_HER_EMAIL || ""; 

export default function Calendar() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  let [isOpen, setIsOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState("");
  let [isOpenEventTitle, setIsOpenEventTitle] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  let [isOpenDetail, setIsOpenDetail] = useState(false);
  const [clickedEvent, setClickedEvent] = useState("");

  useEffect(() => {
    fetchEvents();

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  async function handleCreateAllDayEvent(isDate: boolean) {
    if (!clickedDate) return;

    const nextDay = new Date(clickedDate);
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

  function resetEventState() {
    setClickedDate("");
    setEventTitle("");
    setIsOpen(false);
    setIsOpenEventTitle(false);
  }

  async function dateClick(info: any) {
    setIsOpenEventTitle(true);
    const justTheDate = info.dateStr.split("T")[0];
    setClickedDate(justTheDate);
  }

  async function fetchEvents() {
    const response = await fetch("/api/get-events");
    const data = await response.json();
    const formatted = data.map((e: any) => {
      let color = "#888888"; // fallback, shouldn't normally happen
      if (e.created_by === MY_EMAIL) {
        color = "#3B82F6"; // blue
      } else if (e.created_by === HER_EMAIL) {
        color = "#EC4899"; // pink
      }
      if (e.is_date_night) {
        color = "#8B5CF6"; // purple
      }

      return {
        title: e.title,
        start: e.start_time,
        end: e.end_time,
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
          right: 'dayGridMonth,timeGridDay,prev,next,today',
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
        onSubmit={handleCreateEvent}
        onSubmitAllDay={handleCreateAllDayEvent}
        onCancel={resetEventState}/>
    </div>
  );
}