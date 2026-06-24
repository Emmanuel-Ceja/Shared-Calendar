"use client"
import "@/components/Modal.css";

export default function EventDetailModal({ isOpen, setIsOpen, event, onDelete, currentUserEmail } : {isOpen: boolean; setIsOpen: (value: boolean) => void; event: any; onDelete: (id: string, googleEventId: string | null) => void; currentUserEmail: string }) {

    const exit = () => {
        setIsOpen(false);
    }

    const deleteEvent = () => {
        const { id, google_event_id } = event.extendedProps;
        onDelete(id, google_event_id);
    }

    // Only the person who created the event has a valid Google access
    // token for it, so only they're allowed to delete it.
    const isOwner = isOpen && event?.extendedProps?.created_by === currentUserEmail;

    return (
        
        <>
        {isOpen && (
            <div className="modal">
                <div className="overlay" onClick={exit}></div>
                <div className="modal-content font-dynapuff text-[#839958]">
                    <div className="flex gap-2">
                        <p className="font-bold text-[#0A3323]">Title:</p>
                        <p>{event.title}</p>
                        <p className="font-bold text-[#0A3323]">Start:</p> 
                        <p>{event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} </p>
                        <p className="font-bold text-[#0A3323]">End:</p>
                        <p>{event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <div className="flex justify-between">
                        <button className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958]" onClick={exit}>Exit</button>
                        {isOwner && (
                            <button className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958]" onClick={deleteEvent}>Delete Event</button>
                        )}
                    </div>
                </div>
            </div>
        )}
        
        </>
    )
}