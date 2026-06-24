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
                <div className="modal-content font-dynapuff text-[#839958]">
                    {isLinked ? (
                        <>
                            <p>Unlink from <span className="font-bold text-[#0A3323]">{partnerEmail}</span>?</p>
                            <div className="flex items-center justify-between pt-2">
                                <button className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958]" onClick={close}>Cancel</button>
                                <button className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958]" onClick={confirmUnlink}>Confirm</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <input
                                className="font-dynapuff w-full border-2 border-[#0A3323] rounded-sm px-2 py-1"
                                type="email"
                                placeholder="Partner's email"
                                value={linkEmail}
                                onChange={(e) => setLinkEmail(e.target.value)}
                            />
                            <div className="flex items-center justify-between pt-2">
                                <button className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958]" onClick={close}>Cancel</button>
                                <button className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958]" onClick={confirmLink}>Link User</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )}
        </>
    )
}