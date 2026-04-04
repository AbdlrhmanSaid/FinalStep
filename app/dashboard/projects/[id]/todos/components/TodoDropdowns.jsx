"use client";

import { useState, useRef } from "react";
import { ChevronDown, Check, Tag, Zap } from "lucide-react";
import { STATUS, TYPES } from "./constants";

/* ─── Status Selector Dropdown ───────────────── */
export function StatusDropdown({ currentStatus, onSelect, isRTL, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const cfg = STATUS[currentStatus] || STATUS.todo;
  const Icon = cfg.icon;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all border ${cfg.badge} ${cfg.border} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105 active:scale-95"}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {isRTL ? cfg.label.ar : cfg.label.en}
        </span>
        {!disabled && (
          <ChevronDown
            className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={`absolute z-20 mt-1.5 w-36 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden ${isRTL ? "right-0" : "left-0"}`}
          >
            {Object.entries(STATUS).map(([key, s]) => {
              const SIcon = s.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onSelect(key);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold transition-all ${
                    key === currentStatus
                      ? `${s.activeBg} ${s.color}`
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <SIcon className="w-3.5 h-3.5 shrink-0" />
                  {isRTL ? s.label.ar : s.label.en}
                  {key === currentStatus && <Check className="w-3 h-3 ms-auto" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Type Selector Dropdown ───────────────── */
export function TypeDropdown({ currentType, onSelect, isRTL, disabled }) {
  const [open, setOpen] = useState(false);
  const cfg = TYPES[currentType || "target"] || TYPES.target;
  const Icon = cfg.icon || Zap;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-xs transition-all ${cfg.bg} ${cfg.color} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-80"}`}
      >
        <Icon className="w-3 h-3" />
        {isRTL ? cfg.label.ar : cfg.label.en}
        <ChevronDown
          className={`w-2.5 h-2.5 ms-0.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && !disabled && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div
            className={`absolute z-30 mt-1.5 w-36 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden ${isRTL ? "right-0" : "left-0"}`}
          >
            {Object.entries(TYPES).map(([key, t]) => {
              const TIcon = t.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onSelect(key);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold transition-all ${
                    key === currentType
                      ? `${t.bg} ${t.color}`
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <TIcon className="w-3.5 h-3.5" />
                  {isRTL ? t.label.ar : t.label.en}
                  {key === currentType && <Check className="w-3 h-3 ms-auto" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Section Selector Dropdown ───────────────── */
export function SectionDropdown({
  currentId,
  sections = [],
  onSelect,
  isRTL,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const selected = sections.find((s) => s._id === currentId);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
          selected
            ? "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800"
            : "bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-900 dark:border-gray-700"
        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-90"}`}
      >
        <Tag className="w-3 h-3" />
        {selected ? selected.title : isRTL ? "بدون قسم" : "No Section"}
        {!disabled && (
          <ChevronDown
            className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={`absolute z-20 mt-1.5 w-48 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden ${isRTL ? "right-0" : "left-0"}`}
          >
            <button
              onClick={() => {
                onSelect(null);
                setOpen(false);
              }}
              className="w-full text-start px-3 py-2.5 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-400"
            >
              {isRTL ? "بدون قسم (عام)" : "No Section (General)"}
            </button>
            <div className="max-h-40 overflow-y-auto">
              {sections.map((s) => (
                <button
                  key={s._id}
                  onClick={() => {
                    onSelect(s._id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold ${
                    s._id === currentId
                      ? "bg-violet-50 text-violet-600 dark:bg-violet-900/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {s.title}
                  {s._id === currentId && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
