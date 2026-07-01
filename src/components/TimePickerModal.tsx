"use client"
import "@/components/Modal.css";
import { useState } from "react";
import { WheelPicker, type WheelPickerOption, WheelPickerWrapper } from "@/components/wheel-picker";

const hours: WheelPickerOption[] = Array.from({length: 12}, (_, i) => ({ label: String(i + 1).padStart(2, '0'), value: String(i + 1).padStart(2, '0') }));
const minutes: WheelPickerOption[] = Array.from({length: 60}, (_, i) => ({ label: String(i).padStart(2, '0'), value: String(i).padStart(2, '0') }));
const meridiem: WheelPickerOption[] = [
  { label: 'AM', value: 'AM' },
  { label: 'PM', value: 'PM' }
];

export default function TimePickerModal({isOpen, setIsOpen, onSubmit, onToggleEnd, dateStr}: {isOpen: boolean; setIsOpen: (value: boolean) => void; onSubmit: (startTime: string, endTime: string, isAllDay: boolean, isDate: boolean, endDate?: string) => void; onToggleEnd: () => void; dateStr: string}) {
    const [valueHours, setValueHours] = useState("01");
    const [valueMinutes, setValueMinutes] = useState("00");
    const [valueMeridiem, setValueMeridiem] = useState("AM");
    const [isAllDay, setIsAllDay] = useState(false);
    const [isDate, setIsDate] = useState(false);
    const [isMultiDay, setIsMultiDay] = useState(false);
    const [endDateStr, setEndDateStr] = useState("");

    const handleMultiDayChange = (checked: boolean) => {
        setIsMultiDay(checked);
        if (checked) {
            setIsAllDay(true); 
        }
    }

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const cancel = () => {
        toggleModal();
    }

    const submitAllDay = () => {
        const endDate = isMultiDay ? endDateStr : undefined;
        onSubmit("", "", true, isDate, endDate);
        toggleModal();
    }

    const toggleModalEnd = () => {
        onToggleEnd();
        toggleModal();
    }

    const sendTime = () => {
        let newHour = valueHours;
        if (valueMeridiem === "PM") {
            if (valueHours !== "12") { newHour = String(Number(valueHours) + 12); }
        } else if (valueMeridiem === "AM" && valueHours === "12") {
            newHour = "00";
        }
        return newHour + ":" + valueMinutes + ":00";
    }

    return (
        <>
        {isOpen && (
            <div className="modal">
                <div className="overlay" onClick={cancel}></div>
                <div className="modal-content">
                    <div className="flex flex-col sm:flex-row items-center gap-4 font-dynapuff pb-2">
                        {!isMultiDay && (
                            <label className="flex items-center gap-2 touch-manipulation">
                                <input
                                    type="checkbox"
                                    checked={isAllDay}
                                    onChange={(e) => setIsAllDay(e.target.checked)}
                                />
                                All Day
                            </label>
                        )}
                        <label className="flex items-center gap-2 touch-manipulation">
                            <input
                                type="checkbox"
                                checked={isDate}
                                onChange={(e) => setIsDate(e.target.checked)}
                            />
                            Date
                        </label>
                        <label className="flex items-center gap-2 touch-manipulation">
                            <input
                                type="checkbox"
                                checked={isMultiDay}
                                onChange={(e) => handleMultiDayChange(e.target.checked)}
                            />
                            Multiple Days
                        </label>
                    </div>

                    {!isAllDay && !isMultiDay && (
                        <WheelPickerWrapper>
                            <WheelPicker options={hours} value={valueHours} onValueChange={setValueHours}/>
                            <WheelPicker options={minutes} value={valueMinutes} onValueChange={setValueMinutes}/>
                            <WheelPicker options={meridiem} value={valueMeridiem} onValueChange={setValueMeridiem}/>
                        </WheelPickerWrapper>
                    )}

                    {isMultiDay && (
                        <div className="mb-4">
                            <label className="font-dynapuff text-[#839958]">End Date:</label>
                            <input
                                type="date"
                                value={endDateStr}
                                onChange={(e) => setEndDateStr(e.target.value)}
                                className="font-dynapuff w-full border-2 border-[#0A3323] rounded-sm px-3 py-2 text-base mt-2"
                            />
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
                        <button className="w-full sm:w-auto border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] font-dynapuff px-4 py-2 touch-manipulation" onClick={cancel}>Cancel</button>
                        {isAllDay || isMultiDay ? (
                            <button className="w-full sm:w-auto border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] font-dynapuff px-4 py-2 touch-manipulation" onClick={submitAllDay}>Submit</button>
                        ) : (
                            <button className="w-full sm:w-auto border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958] font-dynapuff px-4 py-2 touch-manipulation" onClick={toggleModalEnd}>Continue</button>
                        )}
                    </div>
                </div>
            </div>
        )}
        </>
    )
}