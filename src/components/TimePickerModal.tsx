"use client"
import "@/components/Modal.css";
import { WheelPicker, type WheelPickerOption, WheelPickerWrapper } from "@/components/wheel-picker";
import { useState } from "react";
import EndTimePickerModal from "./EndTimePickerModal";

const hours: WheelPickerOption[] = [
    { label: "1", value: "01" },
    { label: "2", value: "02" },
    { label: "3", value: "03" },
    { label: "4", value: "04" },
    { label: "5", value: "05" },
    { label: "6", value: "06" },
    { label: "7", value: "07" },
    { label: "8", value: "08" },
    { label: "9", value: "09" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
]
const minutes : WheelPickerOption[] = [
    { label: "00", value: "00" },
    { label: "01", value: "01" },
    { label: "02", value: "02" },
    { label: "03", value: "03" },
    { label: "04", value: "04" },
    { label: "05", value: "05" },
    { label: "06", value: "06" },
    { label: "07", value: "07" },
    { label: "08", value: "08" },
    { label: "09", value: "09" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "13", value: "13" },
    { label: "14", value: "14" },
    { label: "15", value: "15" },
    { label: "16", value: "16" },
    { label: "17", value: "17" },
    { label: "18", value: "18" },
    { label: "19", value: "19" },
    { label: "20", value: "20" },
    { label: "21", value: "21" },
    { label: "22", value: "22" },
    { label: "23", value: "23" },
    { label: "24", value: "24" },
    { label: "25", value: "25" },
    { label: "26", value: "26" },
    { label: "27", value: "27" },
    { label: "28", value: "28" },
    { label: "29", value: "29" },
    { label: "30", value: "30" },
    { label: "31", value: "31" },
    { label: "32", value: "32" },
    { label: "33", value: "33" },
    { label: "34", value: "34" },
    { label: "35", value: "35" },
    { label: "36", value: "36" },
    { label: "37", value: "37" },
    { label: "38", value: "38" },
    { label: "39", value: "39" },
    { label: "40", value: "40" },
    { label: "41", value: "41" },
    { label: "42", value: "42" },
    { label: "43", value: "43" },
    { label: "44", value: "44" },
    { label: "45", value: "45" },
    { label: "46", value: "46" },
    { label: "47", value: "47" },
    { label: "48", value: "48" },
    { label: "49", value: "49" },
    { label: "50", value: "50" },
    { label: "51", value: "51" },
    { label: "52", value: "52" },
    { label: "53", value: "53" },
    { label: "54", value: "54" },
    { label: "55", value: "55" },
    { label: "56", value: "56" },
    { label: "57", value: "57" },
    { label: "58", value: "58" },
    { label: "59", value: "59" },
]
const meridiem : WheelPickerOption[] = [
    { label: "AM", value: "AM" },
    { label: "PM", value: "PM" },
]

export default function TimePickerModal({ isOpen, setIsOpen, onSubmit, onCancel } : {isOpen: boolean; setIsOpen: (value: boolean) => void; onSubmit: (start: string, end: string) => void; onCancel: () => void}) {
    const [valueHours, setValueHours] = useState("01");
    const [valueMinutes, setValueMinutes] = useState("00");
    const [valueMeridiem, setValueMeridiem] = useState("AM");
    let [isOpenEnd, setIsOpenEnd] = useState(false);
    const [startTimeString, setStartTimeString] = useState("");

    const sendTime = () => {
        let newHour = valueHours;
        if (valueMeridiem === "PM") {
            if (valueHours !== "12") {
                newHour = String(Number(valueHours) + 12);
            }
        } else if (valueMeridiem === "AM" && valueHours === "12") {
            newHour = "00";
        } 

        const time = newHour + ":" + valueMinutes + ":00";
        return time;
    }

    const cancel = () => {
        setIsOpenEnd(false);
        setIsOpen(false);
        onCancel();
    }

    const toggleModalEnd = () => {
        setIsOpenEnd(true);
        setIsOpen(false);
        setStartTimeString(sendTime());
    }

    const cancelFromEnd = () => {
        setIsOpenEnd(false);
        cancel();
    }

    return (
        <>
        {isOpen && (
            <div className="modal">
                <div className="overlay" onClick={cancel}></div>
                <div className="modal-content">
                    <WheelPickerWrapper>
                        <WheelPicker options={hours} value={valueHours} onValueChange={setValueHours}/>
                        <WheelPicker options={minutes} value={valueMinutes} onValueChange={setValueMinutes}/>
                        <WheelPicker options={meridiem} value={valueMeridiem} onValueChange={setValueMeridiem}/>
                    </WheelPickerWrapper>
                    <div className="flex items-center justify-between pt-2">
                        <button className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] font-dynapuff" onClick={cancel}>Cancel</button>
                        <button className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] font-dynapuff" onClick={toggleModalEnd}>Continue</button>
                    </div>
                </div>
            </div>
        )}
        {isOpenEnd && (
            <EndTimePickerModal
                isOpen={isOpenEnd}
                setIsOpen={setIsOpenEnd}
                startTime={startTimeString}
                onSubmit={onSubmit}
                onCancel={cancelFromEnd}/>
        )}
        </>
    )
}