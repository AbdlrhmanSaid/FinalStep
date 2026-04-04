"use client";

import { useState } from "react";
import {
  Layers,
  Edit3,
  Trash2,
  Users,
  ChevronDown,
  ChevronUp,
  Star,
  Check,
  UserPlus,
  LoaderCircle,
} from "lucide-react";
import { Avatar, MemberPicker } from "./MemberPicker";
import ConfirmDeleteDialog from "@/components/dashboard/ConfirmDeleteDialog";

/* ─── helpers ──────────────────────────── */
const dName = (u) =>
  u?.name && u.name !== "null null" ? u.name : (u?.email?.split("@")[0] ?? "?");
const initial = (u) => dName(u).charAt(0).toUpperCase();

export default function SectionCard({
  section,
  allMembers,
  isRTL,
  onRename,
  onDelete,
  onSaveMembers,
  isDeleting,
  isSavingMembers,
}) {
  const [expanded, setExpanded] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(section.title);
  const [descVal, setDescVal] = useState(section.description || "");

  const resolvedMembers = (section.members ?? [])
    .map((m) =>
      typeof m === "object" ? m : allMembers.find((u) => u._id === m),
    )
    .filter(Boolean);

  const handleRenameSubmit = () => {
    if (!renameVal.trim()) return;
    onRename(renameVal.trim(), descVal.trim());
    setRenaming(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all">
      {/* ── Card header ── */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5 text-violet-500" />
        </div>

        <div className="flex-1 min-w-0">
          {renaming ? (
            <div className="space-y-3 p-1">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                  {isRTL ? "اسم القسم" : "Section Name"}
                </label>
                <input
                  autoFocus
                  value={renameVal}
                  onChange={(e) => setRenameVal(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-violet-100 dark:border-violet-800 bg-gray-50 dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                  {isRTL ? "الوصف" : "Description"}
                </label>
                <textarea
                  value={descVal}
                  onChange={(e) => setDescVal(e.target.value)}
                  className="w-full h-20 px-3 py-2 rounded-xl border border-violet-100 dark:border-violet-800 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  placeholder={isRTL ? "وصف القسم..." : "Section description..."}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRenameSubmit}
                  className="flex-1 h-10 flex items-center justify-center gap-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all text-xs font-black"
                >
                  <Check className="w-4 h-4" />
                  {isRTL ? "حفظ التعديلات" : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setRenaming(false);
                    setRenameVal(section.title);
                    setDescVal(section.description || "");
                  }}
                  className="h-10 px-4 flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-bold text-xs"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-gray-900 dark:text-white">
                  {section.title}
                </h3>
                {section.isDefault && (
                  <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-100 dark:border-amber-900/50">
                    <Star className="w-2.5 h-2.5" />
                    {isRTL ? "افتراضي" : "Default"}
                  </span>
                )}
              </div>
              {section.description && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                  {section.description}
                </p>
              )}
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                {resolvedMembers.length > 0
                  ? isRTL
                    ? `${resolvedMembers.length} عضو مرتبط`
                    : `${resolvedMembers.length} member${resolvedMembers.length !== 1 ? "s" : ""} assigned`
                  : isRTL
                    ? "لا يوجد أعضاء مرتبطون"
                    : "No members assigned"}
              </p>
            </div>
          )}
        </div>

        {!renaming && (
          <div className="flex items-center gap-1 shrink-0">
            {!section.isDefault && (
              <button
                onClick={() => setRenaming(true)}
                title={isRTL ? "تعديل اسم القسم" : "Rename section"}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {!section.isDefault && (
              <ConfirmDeleteDialog
                trigger={
                  <button
                    disabled={isDeleting}
                    title={isRTL ? "حذف القسم" : "Delete section"}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all disabled:opacity-40"
                  >
                    {isDeleting ? (
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                }
                title={isRTL ? "حذف القسم؟" : "Delete Section?"}
                description={
                  isRTL
                    ? `هل أنت متأكد من حذف قسم "${section.title}"؟`
                    : `Are you sure you want to delete "${section.title}"?`
                }
                onConfirm={onDelete}
                loading={isDeleting}
                cancelText={isRTL ? "إلغاء" : "Cancel"}
                confirmText={isRTL ? "حذف" : "Delete"}
              />
            )}
            <button
              onClick={() => setExpanded((p) => !p)}
              title={isRTL ? "إدارة الأعضاء" : "Manage members"}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all font-medium ${
                expanded
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-300 dark:shadow-violet-900"
                  : "text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30"
              }`}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <Users className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {!expanded && resolvedMembers.length > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full flex items-center gap-2 px-4 pb-3.5 hover:opacity-80 transition-opacity group"
        >
          <div className="flex -space-x-1.5 rtl:space-x-reverse">
            {resolvedMembers.slice(0, 5).map((m) => (
              <div
                key={m._id}
                className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 bg-violet-100 dark:bg-violet-800 flex items-center justify-center text-[9px] font-black text-violet-700 dark:text-violet-200"
              >
                {m.image ? (
                  <img
                    src={m.image}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  initial(m)
                )}
              </div>
            ))}
            {resolvedMembers.length > 5 && (
              <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[9px] font-black text-gray-500">
                +{resolvedMembers.length - 5}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold group-hover:text-violet-500 transition-colors">
            {isRTL ? "تعديل الأعضاء" : "Edit members"}
          </span>
        </button>
      )}

      {/* Empty members CTA */}
      {!expanded && resolvedMembers.length === 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-violet-500 dark:text-violet-400 pb-3.5 hover:text-violet-700 transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          {isRTL ? "إضافة أعضاء للقسم" : "Add members to this section"}
        </button>
      )}

      {expanded && (
        <div className="px-4 pb-4">
          <MemberPicker
            section={section}
            allMembers={allMembers}
            sections={sections}
            isRTL={isRTL}
            onSave={(ids) => {
              setExpanded(false);
              onSaveMembers(ids);
            }}
            isSaving={isSavingMembers}
            onClose={() => setExpanded(false)}
          />
        </div>
      )}
    </div>
  );
}
