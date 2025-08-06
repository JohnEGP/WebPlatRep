import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

export default function DatePicker({
  value,
  onChange,
  onClose,
}: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [viewDate, setViewDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  );

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  // Generate calendar days for current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear, currentMonth, day));
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setViewDate(
      new Date(currentYear, currentMonth + (direction === "next" ? 1 : -1), 1),
    );
  };

  const handleDateClick = (date: Date) => {
    onChange(date);
    onClose();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === currentDate.toDateString();
  };

  return (
    <div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">
          {viewDate.toLocaleDateString("pt-PT", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={index} className="h-8" />;
          }

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`h-8 w-8 text-sm rounded-md hover:bg-gray-100 transition-colors ${
                isToday(date)
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : isSelected(date)
                    ? "bg-blue-500 text-white"
                    : "text-gray-700"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDateClick(new Date())}
        >
          Hoje
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
}
