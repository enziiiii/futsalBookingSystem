import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import English locale
import localizedFormat from "dayjs/plugin/localizedFormat";
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(localizedFormat);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

// Generate time slots from 6:00 AM to 8:00 PM
const timeSlots = Array.from({ length: 15 }, (_, i) => `${6 + i}:00`);

const mockAvailability = {
  "2025-04-14": ["08:00", "09:00", "10:00", "11:00", "16:00"],
  "2025-04-15": ["10:00", "11:00", "12:00", "13:00", "14:00"],
  "2025-04-16": ["08:00", "09:00", "10:00", "11:00"],
  "2025-04-17": ["15:00", "16:00", "17:00", "18:00"],
  "2025-04-18": ["08:00", "09:00", "13:00", "14:00"],
  "2025-04-19": ["10:00", "11:00", "12:00"],
  "2025-04-20": ["08:00", "09:00", "10:00", "11:00"]
};

export default function CourtAvailability() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const today = dayjs();
  const startOfWeek = selectedDate.startOf("week").add(1, "day"); // Start from Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));

  const handleSlotSelect = (dateStr, time) => {
    setSelectedSlot({ date: dateStr, time });
  };

  const isBooked = (dateStr, time) => !mockAvailability[dateStr]?.includes(time);

  const format12Hour = (timeStr) => {
    return dayjs(timeStr, "H:mm").format("h:mm A");
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-lg mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate(selectedDate.subtract(7, "day"))}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <ChevronLeft />
          </button>

          <select
            value={selectedDate.format("MMMM")}
            onChange={(e) => {
              const monthIndex = dayjs().localeData().months().indexOf(e.target.value);
              setSelectedDate(selectedDate.month(monthIndex));
            }}
            className="border px-3 py-1 rounded-md shadow-sm"
          >
            {dayjs().localeData().months().map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSelectedDate(today)}
            className="ml-4 text-sm text-cyan-600 hover:underline"
          >
            Back to Today
          </button>

          <button
            onClick={() => setSelectedDate(selectedDate.add(7, "day"))}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <ChevronRight />
          </button>
        </div>

        <span className="text-sm text-gray-500">{selectedDate.format("YYYY")}</span>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-2 text-center mb-4">
        {weekDays.map((day) => (
          <div key={day.format("YYYY-MM-DD")}>
            <p className="text-sm font-semibold text-gray-700">{day.format("ddd")}</p>
            <p
              className={`text-lg font-bold ${
                day.isSame(today, "day") ? "text-cyan-600" : "text-gray-800"
              }`}
            >
              {day.format("D")}
            </p>
          </div>
        ))}
      </div>

      {/* Time Slots */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dateStr = day.format("YYYY-MM-DD");
          return (
            <div key={dateStr} className="flex flex-col gap-2 items-center">
              {timeSlots.map((time) => {
                const isSlotBooked = isBooked(dateStr, time);
                const isSelected =
                  selectedSlot?.date === dateStr && selectedSlot?.time === time;

                return (
                  <button
                    key={time}
                    disabled={isSlotBooked}
                    onClick={() => handleSlotSelect(dateStr, time)}
                    className={`px-3 py-1 rounded-md text-sm w-full max-w-[80px] transition-all
                      ${
                        isSlotBooked
                          ? "bg-red-100 text-red-600 cursor-not-allowed"
                          : isSelected
                          ? "bg-cyan-600 text-white font-semibold shadow-md"
                          : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                      }
                    `}
                  >
                    {format12Hour(time)}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Selected Info */}
      {selectedSlot && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Selected:{" "}
          <span className="font-semibold text-cyan-700">
            {selectedSlot.date} @ {format12Hour(selectedSlot.time)}
          </span>
        </div>
      )}

      {/* Next Button
      <div className="flex justify-end mt-6">
        <button className="bg-cyan-600 text-white px-6 py-2 rounded-xl font-medium shadow hover:bg-cyan-700 transition-all">
          Next
        </button>
      </div> */}
    </div>
  );
}