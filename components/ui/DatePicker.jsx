"use client";

import { useState, useRef, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  parseISO,
} from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * DatePicker component
 * @param {string} value - ISO date string "YYYY-MM-DD" or ""
 * @param {Function} onChange - called with "YYYY-MM-DD" or ""
 * @param {string} placeholder - placeholder text
 * @param {boolean} disablePast - if true, past dates are disabled
 * @param {string} locale - "ar" | "en"
 * @param {string} className - extra classes
 */
export default function DatePicker({
  value = "",
  onChange,
  placeholder = "Select date",
  disablePast = false,
  locale = "en",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() =>
    value ? parseISO(value) : new Date(),
  );
  const containerRef = useRef(null);

  const dateLocale = locale === "ar" ? ar : enUS;
  const selected = value ? parseISO(value) : null;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Build calendar days grid
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const weekDays =
    locale === "ar"
      ? ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"]
      : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handleDayClick = (day) => {
    if (disablePast && isBefore(day, new Date()) && !isToday(day)) return;
    onChange(format(day, "yyyy-MM-dd"));
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setViewDate(new Date());
  };

  const isDayDisabled = (day) => {
    if (!disablePast) return false;
    return isBefore(day, new Date()) && !isToday(day);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`
          w-full flex items-center justify-between gap-2
          h-11 px-4 rounded-lg border text-sm font-medium
          transition-all duration-200
          bg-white dark:bg-gray-800
          border-gray-300 dark:border-gray-600
          text-gray-700 dark:text-gray-200
          hover:border-blue-400 dark:hover:border-blue-500
          focus:outline-none focus:ring-2 focus:ring-blue-500/40
          ${open ? "border-blue-500 ring-2 ring-blue-500/30" : ""}
          ${selected ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}
        `}
      >
        <span className="flex items-center gap-2 flex-1 text-start">
          <Calendar
            className={`w-4 h-4 shrink-0 ${selected ? "text-blue-500" : "text-gray-400"}`}
          />
          {selected
            ? format(selected, "PPP", { locale: dateLocale })
            : placeholder}
        </span>
        {selected && (
          <span
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors"
            role="button"
            aria-label="Clear date"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {/* Dropdown Calendar */}
      {open && (
        <div
          className={`
            absolute z-50 mt-2 p-4 rounded-xl shadow-2xl
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            w-72 animate-in fade-in-0 zoom-in-95 duration-150
            ${locale === "ar" ? "right-0" : "left-0"}
          `}
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setViewDate((d) => subMonths(d, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm font-semibold text-gray-800 dark:text-white">
              {format(viewDate, "MMMM yyyy", { locale: dateLocale })}
            </span>

            <button
              type="button"
              onClick={() => setViewDate((d) => addMonths(d, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-1">
            {weekDays.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day) => {
              const isCurrentMonth = isSameMonth(day, viewDate);
              const isSelected = selected && isSameDay(day, selected);
              const isCurrentDay = isToday(day);
              const disabled = isDayDisabled(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleDayClick(day)}
                  className={`
                    w-full aspect-square flex items-center justify-center
                    text-xs font-medium rounded-lg transition-all duration-150
                    ${
                      disabled
                        ? "opacity-25 cursor-not-allowed text-gray-400"
                        : "cursor-pointer"
                    }
                    ${!isCurrentMonth ? "text-gray-300 dark:text-gray-600" : ""}
                    ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105"
                        : isCurrentDay && !disabled
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold"
                          : isCurrentMonth && !disabled
                            ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            : ""
                    }
                  `}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                setViewDate(new Date());
                if (!disablePast || isToday(new Date())) {
                  onChange(format(new Date(), "yyyy-MM-dd"));
                  setOpen(false);
                }
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
            >
              {locale === "ar" ? "اليوم" : "Today"}
            </button>
            {selected && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors"
              >
                {locale === "ar" ? "مسح" : "Clear"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
