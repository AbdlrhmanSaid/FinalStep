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
      className={`group relative flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border transition-all duration-200 ${
        isOptimistic ? "opacity-50 animate-pulse" : ""
      } ${cfg.border} ${cfg.hover} bg-white dark:bg-gray-800/60 backdrop-blur-sm`}
    >
      {/* Indicator bar */}
      <div
        className={`absolute ${isRTL ? "right-0" : "left-0"} top-3 bottom-3 w-1 rounded-full ${cfg.progressColor} opacity-60`}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 min-w-0 ${isRTL ? "pr-3" : "pl-3"} flex flex-col gap-2.5`}
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
                  className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={saveEdit}
                    disabled={isUpdating}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    title={isRTL ? "حفظ" : "Save"}
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditText(todo.text);
                    }}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
                    title={isRTL ? "إلغاء" : "Cancel"}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 bg-gray-50/50 dark:bg-black/20 p-2 rounded-xl border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
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
                <div className="flex items-center gap-2 border-s border-gray-200 dark:border-gray-700 ps-3">
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
            <div className="space-y-2">
              {/* Labels Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border shadow-sm ${TYPES[todo.type || "target"]?.bg} ${TYPES[todo.type || "target"]?.color} border-current/10`}
                >
                  {(() => {
                    const TIcon = TYPES[todo.type || "target"]?.icon || Zap;
                    return <TIcon className="w-3 h-3" />;
                  })()}
                  {isRTL
                    ? TYPES[todo.type || "target"]?.label.ar
                    : TYPES[todo.type || "target"]?.label.en}
                </span>

                {section && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 text-[9px] font-black uppercase tracking-wider border border-violet-100 dark:border-violet-900/40">
                    <LayoutGrid className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{section.title}</span>
                  </span>
                )}
              </div>

              {/* Text */}
              <p
                className={`text-sm sm:text-base font-bold leading-relaxed break-words ${
                  todo.status === "done"
                    ? "line-through text-gray-400 dark:text-gray-400/60"
                    : "text-gray-800 dark:text-gray-100"
                }`}
              >
                {isOptimistic && (
                  <Loader2 className="inline w-3.5 h-3.5 animate-spin me-2 text-gray-400" />
                )}
                {todo.text}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Controls Area */}
      {!editing && (
        <div className={`flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3 shrink-0 ${isRTL ? 'sm:-mr-1' : 'sm:-ml-1'} pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-700/50`}>
          <StatusDropdown
            currentStatus={todo.status}
            onSelect={changeStatus}
            isRTL={isRTL}
            disabled={!isLeader || isOptimistic || isUpdating}
          />
          
          {isLeader && !isOptimistic && (
            <div className="flex sm:flex-col gap-1.5 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setEditText(todo.text);
                }}
                className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all active:scale-95"
                title={isRTL ? "تعديل" : "Edit"}
              >
                <Pencil className="w-4 h-4" />
              </button>
              
              <ConfirmDeleteDialog
                trigger={
                  <button
                    type="button"
                    disabled={isDeleting}
                    className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all active:scale-95"
                    title={isRTL ? "حذف" : "Delete"}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
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
  );
}
