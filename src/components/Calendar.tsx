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

  async function handleCreateEvent(startTime: string, endTime: string) {
    if (!clickedDate) return;

    const event = {
      summary: "New Event", // we'll improve this later
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
      setIsOpen(false);
    } else {
      alert("Failed to create event.");
    }
  }

  async function dateClick(info: any) {
    /*fix this ended here removed the opening of the timepickermodal*/
    setIsOpenEventTitle(true);
    setClickedDate(info.dateStr);
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
        onSubmit={setEventTitle}/>
      <TimePickerModal 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={handleCreateEvent}/>
    </div>
  );
}