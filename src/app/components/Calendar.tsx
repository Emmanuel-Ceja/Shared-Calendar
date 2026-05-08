"use client"

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar() {
    function dateClick(event) {
        const title = prompt("Title of the Event");
        const timeInput = prompt("Start and End Time (##:## - ##:##)");
        const time = " Time: " + timeInput;
        if (title && timeInput) event.view.calendar.addEvent({
            title: title,
            start: event.dateStr,
            extendedProps: {
                time: "Time: " + timeInput
            }
        });
    }
    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={"dayGridMonth"}
                dateClick={dateClick}
                headerToolbar={{
                    right: 'dayGridMonth,timeGridWeek,prev,next,today',
                    center: 'title',
                    left: ''
                }}
                //theme system next and go through full calendar docs
                eventContent={(info) => {
                    return (
                        <div>
                            <div>{info.event.title}</div>
                            <div>{info.event.extendedProps.time}</div>
                        </div>
                    )
                }}
            />
        </div>
    )
}