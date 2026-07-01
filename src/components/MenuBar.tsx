"use client"
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function MenuBar({ isLinked, onOpenLinkModal, onImportGoogle, isImporting, isImportDisabled } : { isLinked: boolean; onOpenLinkModal: () => void; onImportGoogle: () => void; isImporting: boolean; isImportDisabled: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const isButtonDisabled = isImporting || isImportDisabled;

    return (
        <div className="relative font-dynapuff">
            <button
                className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] px-4 py-2 text-lg touch-manipulation"
                onClick={toggleMenu}
            >
                ☰
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-1 flex flex-col border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] z-50 min-w-max">
                    <button
                        className={`px-4 py-3 text-left touch-manipulation ${
                          isButtonDisabled
                            ? "opacity-50 cursor-not-allowed" 
                            : "hover:bg-[#839958] hover:text-[#0A3323] active:bg-[#839958] active:text-[#0A3323]"
                        }`}
                        onClick={() => { setIsOpen(false); onImportGoogle(); }}
                        disabled={isButtonDisabled}
                    >
                        {isImporting ? "Importing..." : isImportDisabled ? "Loading..." : "Import Google Calendar"}
                    </button>
                    <button
                        className="px-4 py-3 text-left hover:bg-[#839958] hover:text-[#0A3323] active:bg-[#839958] active:text-[#0A3323] touch-manipulation"
                        onClick={() => { setIsOpen(false); onOpenLinkModal(); }}
                    >
                        {isLinked ? "Unlink Partner" : "Link Partner"}
                    </button>
                    <button
                        className="px-4 py-3 text-left hover:bg-[#839958] hover:text-[#0A3323] active:bg-[#839958] active:text-[#0A3323] touch-manipulation"
                        onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    )
}