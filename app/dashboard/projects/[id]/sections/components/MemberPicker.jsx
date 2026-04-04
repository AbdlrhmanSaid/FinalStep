"use client";

import { useState } from "react";
import { UserPlus, UserMinus, Check, LoaderCircle } from "lucide-react";

/* ─── helpers ──────────────────────────── */
const dName = (u) =>
  u?.name && u.name !== "null null" ? u.name : (u?.email?.split("@")[0] ?? "?");
const initial = (u) => dName(u).charAt(0).toUpperCase();

/* ─── Member Avatar ─────────────────────── */
export function Avatar({ user, size = "sm", selected = false }) {
  const s = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${s} rounded-full flex items-center justify-center font-black shrink-0 border-2 transition-all ${
        selected
          ? "border-violet-400 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
          : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
      }`}
    >
      {user?.image ? (
        <img
          src={user.image}
          alt=""
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        initial(user)
      )}
    </div>
  );
}

/* ─── Member Picker ─────────────────────── */
export function MemberPicker({
  section,
  allMembers,
  isRTL,
  onSave,
  isSaving,
  onClose,
}) {
  const currentIds =
    section.members?.map((m) => (typeof m === "object" ? m._id : m)) ?? [];
  const [selected, setSelected] = useState(currentIds);

  const toggle = (id) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  return (
    <div className="mt-3 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
          {selected.length}/{allMembers.length} {isRTL ? "محدد" : "selected"}
        </p>
        <div className="flex gap-3 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelected(allMembers.map((m) => m._id))}
            className="flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:underline"
          >
            <UserPlus className="w-3 h-3" />
            {isRTL ? "الكل" : "All"}
          </button>
          <button
            type="button"
            onClick={() => setSelected([])}
            className="flex items-center gap-1 text-rose-500 dark:text-rose-400 hover:underline"
          >
            <UserMinus className="w-3 h-3" />
            {isRTL ? "إلغاء" : "None"}
          </button>
        </div>
      </div>

      {allMembers.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">
          {isRTL ? "لا يوجد أعضاء في الفريق" : "No team members"}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {allMembers.map((member) => {
            const sel = selected.includes(member._id);
            return (
              <button
                key={member._id}
                type="button"
                onClick={() => toggle(member._id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-start transition-all ${
                  sel
                    ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20"
                    : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-900"
                }`}
              >
                <Avatar user={member} size="sm" selected={sel} />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-bold truncate leading-none ${sel ? "text-violet-900 dark:text-violet-100" : "text-gray-800 dark:text-gray-200"}`}
                  >
                    {dName(member)}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                    {member.email}
                  </p>
                </div>
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    sel
                      ? "border-violet-500 bg-violet-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {sel && (
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          {isRTL ? "إلغاء" : "Cancel"}
        </button>
        <button
          type="button"
          onClick={() => onSave(selected)}
          disabled={isSaving}
          className="flex-1 h-10 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-sm font-black text-white transition-all flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {isRTL ? "حفظ" : "Save"}
        </button>
      </div>
    </div>
  );
}
