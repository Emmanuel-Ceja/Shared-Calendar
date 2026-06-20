"use client"
import "@/components/Modal.css";
import { WheelPicker, type WheelPickerOption, WheelPickerWrapper } from "@ncdai/react-wheel-picker";
import { useState } from "react";

const hours: WheelPickerOption[] = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
]

export default function TimePickerModal({ isOpen, setIsOpen } : {isOpen: boolean; setIsOpen: (value: boolean) => void}) {
    const [value, setValue] = useState("1");
    const toggleModal = () => {
        setIsOpen(!isOpen)
    }
    return (
        <>
        {isOpen && (
            <div className="modal">
                <div className="overlay" onClick={toggleModal}></div>
                <div className="modal-content">
                    <WheelPickerWrapper>
                        <WheelPicker options={hours} value={value} onValueChange={setValue}/>
                    </WheelPickerWrapper>
                </div>
            </div>
        )}
        
        </>
    )
}