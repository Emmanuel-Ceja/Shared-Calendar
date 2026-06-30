"use client"
import "@/components/Modal.css";
import { useState } from "react";

export default function EventTitleModal({isOpen, setIsOpen, onSubmit, onContinue, onCancel}: {isOpen: boolean; setIsOpen: (value: boolean) => void; onSubmit: (title: string) => void; onContinue: () => void; onCancel: () => void}) {
    const [eventTitle, setEventTitle] = useState("");

    const cancel = () => {
        setEventTitle(""); 
        setIsOpen(false);
        onCancel();
    }

    const submit = () => {
        onSubmit(eventTitle);
        setIsOpen(false);
        onContinue();
    }
    return (
        <>
        {isOpen && (
            <div className="modal font-dynapuff">
                <div className="overlay" onClick={cancel}></div>
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="Event Title"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                    />
                    <button className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] font-dynapuff" onClick={cancel}>Cancel</button>
                    <button className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] font-dynapuff" onClick={submit}>Continue</button>
                </div>
            </div>
        )}
        
        </>
    )
}