"use client";

import { useState } from "react";
import { Check, Pencil, X, Loader2, Trash2, Zap, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";
import {
  useUpdateTodo,
  useDeleteTodo,
} from "@/hooks/projects/useProjectTodos";
import { STATUS, TYPES } from "./constants";
import { StatusDropdown, TypeDropdown, SectionDropdown } from "./TodoDropdowns";
import ConfirmDeleteDialog from "@/components/dashboard/ConfirmDeleteDialog";

export default function TodoItem({
  todo,
  projectId,
  userId,
  isRTL,
  isLeader,
  view,
  sections = [],
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editSectionId, setEditSectionId] = useState(todo.sectionId);
  const [editType, setEditType] = useState(todo.type || "target");
  const { mutate: update, isPending: isUpdating } = useUpdateTodo(projectId);
  const { mutate: del, isPending: isDeleting } = useDeleteTodo(projectId);

  const isOptimistic = todo._id?.toString().startsWith("tmp-");
  const cfg = STATUS[todo.status] || STATUS.todo;

  const changeStatus = (newStatus) => {
    if (isOptimistic || newStatus === todo.status) return;
    update(
      { _id: todo._id, status: newStatus, userId },
      {
        onError: () =>
          toast.error(isRTL ? "فشل تغيير الحالة" : "Failed to update"),
      },
    );
  };

  const saveEdit = () => {
    if (!editText.trim() || isOptimistic) return;
    update(
      {
        _id: todo._id,
        text: editText.trim(),
        sectionId: editSectionId,
        type: editType,
        userId,
      },
      {
        onSuccess: () => setEditing(false),
        onError: () => toast.error(isRTL ? "فشل الحفظ" : "Failed to save"),
      },
    );
  };

  const section = sections.find((s) => (s._id || s) === todo.sectionId);

  return (
    <div
      className={`group relative flex gap-3 p-4 rounded-2xl border transition-all duration-200 ${
        isOptimistic ? "opacity-50 animate-pulse" : ""
      } ${cfg.border} ${cfg.hover} bg-white dark:bg-gray-800/60 backdrop-blur-sm`}
    >
      <div
        className={`absolute ${isRTL ? "right-0" : "left-0"} top-3 bottom-3 w-1 rounded-full ${cfg.progressColor} opacity-60`}
      />

      <div
        className={`flex-1 min-w-0 ${isRTL ? "pr-3" : "pl-3"} flex ${view === "grid" ? "flex-col gap-2.5" : "flex-row items-center gap-3"}`}
      >
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") {
                      setEditText(todo.text);
                      setEditing(false);
                    }
                  }}
                  autoFocus
                  className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-1.5 text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={saveEdit}
                  disabled={isUpdating}
                  className="p-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                >
                  {isUpdating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditText(todo.text);
                  }}
                  className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase text-gray-400">
                    {isRTL ? "النوع:" : "Type:"}
                  </span>
                  <TypeDropdown
                    currentType={editType}
                    onSelect={setEditType}
                    isRTL={isRTL}
                    disabled={isUpdating}
                  />
                </div>
                <div className="flex items-center gap-1.5 border-s border-gray-100 dark:border-gray-700 ps-3">
                  <span className="text-[10px] font-black uppercase text-gray-400">
                    {isRTL ? "القسم:" : "Section:"}
                  </span>
                  <SectionDropdown
                    currentId={editSectionId}
                    sections={sections}
                    onSelect={setEditSectionId}
                    isRTL={isRTL}
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <p
                className={`text-sm font-bold leading-snug wrap-break-word ${
                  todo.status === "done"
                    ? "line-through text-gray-400 dark:text-gray-400/60"
                    : "text-gray-800 dark:text-gray-100"
                }`}
              >
                {isOptimistic && (
                  <Loader2 className="inline w-3 h-3 animate-spin me-1.5 text-gray-400" />
                )}
                {todo.text}
              </p>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border shadow-2xs ${TYPES[todo.type || "target"]?.bg} ${TYPES[todo.type || "target"]?.color} border-current/10`}
                >
                  {(() => {
                    const TIcon = TYPES[todo.type || "target"]?.icon || Zap;
                    return <TIcon className="w-2.5 h-2.5" />;
                  })()}
                  {isRTL
                    ? TYPES[todo.type || "target"]?.label.ar
                    : TYPES[todo.type || "target"]?.label.en}
                </span>

                {section && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 text-[9px] font-black uppercase border border-violet-100 dark:border-violet-900/40">
                    <LayoutGrid className="w-2.5 h-2.5" />
                    {section.title}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {!editing && (
          <div className="flex items-center gap-2 shrink-0">
            <StatusDropdown
              currentStatus={todo.status}
              onSelect={changeStatus}
              isRTL={isRTL}
              disabled={!isLeader || isOptimistic || isUpdating}
            />
            {isLeader && !isOptimistic && (
              <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setEditText(todo.text);
                  }}
                  className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <ConfirmDeleteDialog
                  trigger={
                    <button
                      type="button"
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  }
                  title={isRTL ? "حذف العنصر؟" : "Delete Item?"}
                  description={
                    isRTL
                      ? "هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الفعل."
                      : "Are you sure you want to delete this item? This action cannot be undone."
                  }
                  onConfirm={() =>
                    del(
                      { todoId: todo._id, userId },
                      {
                        onError: () =>
                          toast.error(isRTL ? "فشل الحذف" : "Failed"),
                      },
                    )
                  }
                  loading={isDeleting}
                  cancelText={isRTL ? "إلغاء" : "Cancel"}
                  confirmText={isRTL ? "حذف" : "Delete"}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
