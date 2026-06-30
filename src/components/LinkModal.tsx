"use client"
import "@/components/Modal.css";
import { useState } from "react";

export default function LinkModal({ isOpen, setIsOpen, isLinked, partnerEmail, onLink, onUnlink } : {isOpen: boolean; setIsOpen: (value: boolean) => void; isLinked: boolean; partnerEmail: string; onLink: (email: string) => void; onUnlink: () => void }) {
    const [linkEmail, setLinkEmail] = useState("");

    const close = () => {
        setIsOpen(false);
        setLinkEmail("");
    }

    const confirmLink = () => {
        onLink(linkEmail);
        close();
    }

    const confirmUnlink = () => {
        onUnlink();
        close();
    }

    return (
        <>
        {isOpen && (
            <div className="modal">
                <div className="overlay" onClick={close}></div>
                <div className="modal-content font-dynapuff text-[#839958] max-w-sm mx-auto">
                    {isLinked ? (
                        <>
                            <p className="mb-4">Unlink from <span className="font-bold text-[#0A3323]">{partnerEmail}</span>?</p>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
                                <button className="w-full sm:w-auto border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] px-4 py-2 touch-manipulation" onClick={close}>Cancel</button>
                                <button className="w-full sm:w-auto border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] px-4 py-2 touch-manipulation" onClick={confirmUnlink}>Confirm</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <input
                                className="font-dynapuff w-full border-2 border-[#0A3323] rounded-sm px-3 py-2 text-base mb-4"
                                type="email"
                                placeholder="Partner's email"
                                value={linkEmail}
                                onChange={(e) => setLinkEmail(e.target.value)}
                            />
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
                                <button className="w-full sm:w-auto border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] px-4 py-2 touch-manipulation" onClick={close}>Cancel</button>
                                <button className="w-full sm:w-auto border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] px-4 py-2 touch-manipulation" onClick={confirmLink}>Link User</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )}
        </>
    )
}