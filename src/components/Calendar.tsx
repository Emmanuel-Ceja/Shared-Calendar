"use client"
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TimePickerModal from "@/components/TimePickerModal";
import EventTitleModal from "./EventTitleModal";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  let [isOpen, setIsOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState("");
  let [isOpenEventTitle, setIsOpenEventTitle] = useState(false);
  const [eventTitle, setEventTitle] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function handleCreateEvent(startTime: string, endTime: string) {
    if (!clickedDate) return;

    const event = {
      summary: eventTitle || "New Event",
      start: { dateTime: `${clickedDate}T${startTime}-07:00` },
      end: { dateTime: `${clickedDate}T${endTime}-07:00` },
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

  async function handleCreateAllDayEvent() {
    if (!clickedDate) return;

    // Google's "end" date is exclusive for all-day events, so a single
    // day event needs end = start + 1 day, not end = start.
    const nextDay = new Date(clickedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const endDateString = nextDay.toISOString().split("T")[0];

    const event = {
      summary: eventTitle || "New Event",
      start: { date: clickedDate },
      end: { date: endDateString },
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

  // Clears out any leftover data from a cancelled or completed attempt
  // so the next time the user opens the flow, it starts fresh.
  function resetEventState() {
    setClickedDate("");
    setEventTitle("");
    setIsOpen(false);
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
    const formatted = data.map((e: any) => ({
      title: e.title,
      start: e.start_time,
      end: e.end_time,
    }));
    setEvents(formatted);
  }

  return (
    <div style={{ width: "100%", height: "100vh", padding: "20px", boxSizing: "border-box" }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        dateClick={dateClick}
        events={events}
        height="100%"
        headerToolbar={{
          right: 'dayGridMonth,timeGridWeek,prev,next,today',
          center: 'title',
          left: ''
        }}
      />
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