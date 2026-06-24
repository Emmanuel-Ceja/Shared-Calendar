"use client"
import "@/components/Modal.css";
import { useState } from "react";

export default function EventTitleModal({isOpen, setIsOpen, onSubmit, onContinue}: {isOpen: boolean; setIsOpen: (value: boolean) => void; onSubmit: (title: string) => void; onContinue: () => void}) {
    const [eventTitle, setEventTitle] = useState("");
    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const submit = () => {
        onSubmit(eventTitle);
        toggleModal();
        onContinue();
    }
    return (
        <>
        {isOpen && (
            <div className="modal">
                <div className="overlay" onClick={toggleModal}></div>
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="Event Title"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                    />
                    <button className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] font-dynapuff" onClick={submit}>Continue</button>
                </div>
            </div>
        )}
        
        </>
    )
}