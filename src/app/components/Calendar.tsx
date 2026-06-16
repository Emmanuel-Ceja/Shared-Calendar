"use client"

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar() {
    async function dateClick(info: any) {
        const date = info.dateStr; // the date the user clicked

        const summary = prompt("Enter event title") ?? "";
        const startTime = prompt("Enter start time (HH:MM)") ?? "";
        const endTime = prompt("Enter end time (HH:MM)") ?? "";

        const event = {
            summary: summary,
            start: { dateTime: `${date}T${startTime}:00-07:00` },
            end: { dateTime: `${date}T${endTime}:00-07:00` },
        };

        const response = await fetch("/api/create-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event),
        });

        if (response.ok) {
            alert("Event created successfully!");
        } else {
            alert("Failed to create event.");
        }
    }
    
    return (
        <div style= {{ width: "100%", height: "100vh", padding: "20px", boxSizing: "border-box"}}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={"dayGridMonth"}
                dateClick={dateClick}
                headerToolbar={{
                    right: 'dayGridMonth,timeGridWeek,prev,next,today',
                    center: 'title',
                    left: ''
                }}
                
            />
        </div>
    )
}