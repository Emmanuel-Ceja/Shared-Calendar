"use client"
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TimePickerModal from "@/components/TimePickerModal";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
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
    fetchEvents();
  }, []);

  async function dateClick(info: any) {
    console.log("date clicked, isOpen should be true now");
    setIsOpen(true);
    /*const date = info.dateStr;
    const summary = prompt("Enter event title") ?? "";
    const startTime = prompt("Enter start time (HH:MM)") ?? "";
    const endTime = prompt("Enter end time (HH:MM)") ?? "";

    const event = {
      summary,
      start: { dateTime: `${date}T${startTime}:00-07:00` },
      end: { dateTime: `${date}T${endTime}:00-07:00` },
    };

    const response = await fetch("/api/create-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    if (response.ok) {
      alert("Event created!");
      fetchEvents(); // refresh calendar
    } else {
      alert("Failed to create event.");
    }*/
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
      <TimePickerModal 
        isOpen={isOpen}
        setIsOpen={setIsOpen}/>
    </div>
  );
}