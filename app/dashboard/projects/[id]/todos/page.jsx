"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import { useGetProject } from "@/hooks/projects/useGetProjects";
import {
  useProjectTodos,
  useAddTodo,
  useUpdateTodo,
  useDeleteTodo,
} from "@/hooks/projects/useProjectTodos";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import ProjectPageHeader from "../components/ProjectPageHeader";
import {
  Plus,
  Trash2,
  Check,
  Pencil,
  X,
  ClipboardList,
  Loader2,
  CheckCircle2,
  Clock,
  Zap,
  ChevronDown,
  LayoutGrid,
  List,
} from "lucide-react";

/* ─── Status config ──────────────────────────── */
const STATUS = {
  todo: {
    label: { ar: "مستقبلي", en: "To Do" },
    icon: Clock,
    color: "text-slate-500 dark:text-slate-400",
    activeBg: "bg-slate-100 dark:bg-slate-800",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-400 dark:bg-slate-500",
    border: "border-slate-200 dark:border-slate-700",
    hover: "hover:border-slate-300 dark:hover:border-slate-600",
    progressColor: "bg-slate-400",
  },
  doing: {
    label: { ar: "نشط", en: "Active" },
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    activeBg: "bg-amber-50 dark:bg-amber-950/40",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    dot: "bg-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    hover: "hover:border-amber-300 dark:hover:border-amber-700",
    progressColor: "bg-amber-400",
  },
  done: {
    label: { ar: "مكتمل", en: "Done" },
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    dot: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-800",
    hover: "hover:border-emerald-300 dark:hover:border-emerald-700",
    progressColor: "bg-emerald-500",
  },
};

/* ─── Status Selector Dropdown ───────────────── */
function StatusDropdown({ currentStatus, onSelect, isRTL, disabled }) {
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
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${cfg.badge} ${cfg.border} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-90"}`}
      >
        <Icon className="w-3 h-3" />
        {isRTL ? cfg.label.ar : cfg.label.en}
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
                  {key === currentStatus && (
                    <Check className="w-3 h-3 ms-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Single Todo Item ───────────────────────── */
function TodoItem({ todo, projectId, userId, isRTL, isLeader, view }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
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
      { _id: todo._id, text: editText.trim(), userId },
      {
        onSuccess: () => setEditing(false),
        onError: () => toast.error(isRTL ? "فشل الحفظ" : "Failed to save"),
      },
    );
  };

  return (
    <div
      className={`group relative flex gap-3 p-4 rounded-2xl border transition-all duration-200 ${
        isOptimistic ? "opacity-50 animate-pulse" : ""
      } ${cfg.border} ${cfg.hover} bg-white dark:bg-gray-800/60 backdrop-blur-sm`}
    >
      {/* Colored left bar */}
      <div
        className={`absolute ${isRTL ? "right-0" : "left-0"} top-3 bottom-3 w-1 rounded-full ${cfg.progressColor} opacity-60`}
      />

      <div
        className={`flex-1 min-w-0 ${isRTL ? "pr-3" : "pl-3"} flex ${view === "grid" ? "flex-col gap-3" : "flex-col sm:flex-row sm:items-center gap-2"}`}
      >
        {/* Text / Edit */}
        <div className="flex-1 min-w-0">
          {editing ? (
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
                  setEditText(todo.text);
                  setEditing(false);
                }}
                className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <p
              className={`text-sm font-semibold leading-snug break-words ${
                todo.status === "done"
                  ? "line-through text-gray-400 dark:text-gray-500"
                  : "text-gray-800 dark:text-gray-100"
              }`}
            >
              {isOptimistic && (
                <Loader2 className="inline w-3 h-3 animate-spin me-1.5 text-gray-400" />
              )}
              {todo.text}
            </p>
          )}
        </div>

        {/* Status + actions */}
        {!editing && (
          <div className="flex items-center gap-2 shrink-0">
            <StatusDropdown
              currentStatus={todo.status}
              onSelect={changeStatus}
              isRTL={isRTL}
              disabled={!isLeader || isOptimistic || isUpdating}
            />
            {isLeader && !isOptimistic && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditing(true);
                    setEditText(todo.text);
                  }}
                  className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    del(
                      { todoId: todo._id, userId },
                      {
                        onError: () =>
                          toast.error(isRTL ? "فشل الحذف" : "Failed"),
                      },
                    )
                  }
                  disabled={isDeleting}
                  className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Column ─────────────────────────────────── */
function Column({ status, todos, projectId, userId, isRTL, isLeader }) {
  const cfg = STATUS[status];
  const Icon = cfg.icon;
  return (
    <div className="flex flex-col gap-3">
      {/* Column header */}
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border ${cfg.border} ${cfg.activeBg}`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
        <Icon className={`w-4 h-4 ${cfg.color}`} />
        <span className={`text-sm font-black ${cfg.color}`}>
          {isRTL ? cfg.label.ar : cfg.label.en}
        </span>
        <span className="ms-auto text-xs font-black bg-white/60 dark:bg-black/20 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400">
          {todos.length}
        </span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {todos.length === 0 ? (
          <div
            className={`py-10 text-center text-xs text-gray-300 dark:text-gray-600 font-medium border border-dashed ${cfg.border} rounded-2xl`}
          >
            {isRTL ? "لا يوجد عناصر" : "Nothing here"}
          </div>
        ) : (
          todos.map((t) => (
            <TodoItem
              key={t._id}
              todo={t}
              projectId={projectId}
              userId={userId}
              isRTL={isRTL}
              isLeader={isLeader}
              view="grid"
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function TodosPage() {
  const { id: projectId } = useParams();
  const { userId, isRTL } = useAppContext();
  const { data: project, isLoading: loadingProject } = useGetProject(projectId);
  const { data: todos = [], isLoading: loadingTodos } =
    useProjectTodos(projectId);
  const { mutate: addTodo, isPending: isAdding } = useAddTodo(projectId);

  const [newText, setNewText] = useState("");
  const [newStatus, setNewStatus] = useState("todo");
  const [view, setView] = useState("grid"); // "grid" | "list"

  const isLeader =
    project?.leaderId?._id === userId ||
    project?.coLeaders?.some((u) => u._id === userId);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    addTodo(
      { text: newText.trim(), status: newStatus, userId },
      {
        onSuccess: () => {
          setNewText("");
          setNewStatus("todo");
        },
        onError: () => toast.error(isRTL ? "فشل الإضافة" : "Failed to add"),
      },
    );
  };

  const countOf = (s) => todos.filter((t) => t.status === s).length;
  const total = todos.length;
  const doneCount = countOf("done");
  const activeCount = countOf("doing");
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  if (loadingProject || loadingTodos) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={isRTL ? "rtl" : "ltr"}>

      <ProjectPageHeader
        projectId={projectId}
        projectTitle={project?.title}
        icon={ClipboardList}
        iconBg="bg-linear-to-br from-teal-500 to-emerald-600"
        label={isRTL ? "خطة العمل" : "Roadmap"}
        isRTL={isRTL}
        action={
          <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button onClick={() => setView("grid")} className={`p-2.5 transition-all ${view === "grid" ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white" : "text-gray-400 hover:text-gray-600"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-2.5 transition-all ${view === "list" ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white" : "text-gray-400 hover:text-gray-600"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">

        {/* ── Stats bar ── */}
        {total > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex flex-wrap gap-4 flex-1">
                {Object.entries(STATUS).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                      <span className="font-black text-gray-800 dark:text-white">
                        {countOf(key)}
                      </span>{" "}
                      {isRTL ? cfg.label.ar : cfg.label.en}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                  {pct}%
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  {isRTL ? "مكتمل" : "Complete"}
                </div>
              </div>
            </div>
            {/* Progress bar with segments */}
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex gap-0.5">
              {total > 0 && (
                <>
                  {doneCount > 0 && (
                    <div
                      className="bg-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${(doneCount / total) * 100}%` }}
                    />
                  )}
                  {activeCount > 0 && (
                    <div
                      className="bg-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${(activeCount / total) * 100}%` }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Add form (leader only) ── */}
        {isLeader && (
          <form
            onSubmit={handleAdd}
            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder={
                  isRTL
                    ? "أضف عنصراً جديداً للخطة..."
                    : "Add a new roadmap item..."
                }
                className="flex-1 h-11 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm font-semibold text-gray-800 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex gap-2 shrink-0">
                {/* Status picker */}
                <div className="flex rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  {Object.entries(STATUS).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setNewStatus(key)}
                        title={isRTL ? cfg.label.ar : cfg.label.en}
                        className={`px-3.5 py-2 flex items-center gap-1.5 text-xs font-bold transition-all ${
                          newStatus === key
                            ? `${cfg.activeBg} ${cfg.color}`
                            : "bg-white dark:bg-gray-800 text-gray-300 dark:text-gray-600 hover:text-gray-500"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {isRTL ? cfg.label.ar : cfg.label.en}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  disabled={isAdding || !newText.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-black rounded-2xl transition-all shadow-md shadow-teal-500/20"
                >
                  {isAdding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isRTL ? "إضافة" : "Add"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── Content ── */}
        {todos.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 py-20 px-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-teal-400" />
            </div>
            <h3 className="text-lg font-black text-gray-800 dark:text-white mb-2">
              {isRTL ? "لا توجد عناصر بعد" : "No items yet"}
            </h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              {isLeader
                ? isRTL
                  ? "ابدأ بإضافة عناصر لخطة العمل أعلاه."
                  : "Add your first roadmap item above."
                : isRTL
                  ? "لم يتم إضافة أي عنصر بعد من قِبل القائد."
                  : "No items added by the leader yet."}
            </p>
          </div>
        ) : view === "grid" ? (
          /* ── 3-column Grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.keys(STATUS).map((s) => (
              <Column
                key={s}
                status={s}
                todos={todos.filter((t) => t.status === s)}
                projectId={projectId}
                userId={userId}
                isRTL={isRTL}
                isLeader={isLeader}
              />
            ))}
          </div>
        ) : (
          /* ── List view — all items together ── */
          <div className="space-y-5">
            {Object.entries(STATUS).map(([s, cfg]) => {
              const items = todos.filter((t) => t.status === s);
              const Icon = cfg.icon;
              if (items.length === 0) return null;
              return (
                <div key={s} className="space-y-2">
                  <div className={`flex items-center gap-2 px-2 py-1.5`}>
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                    <span
                      className={`text-xs font-black uppercase tracking-widest ${cfg.color}`}
                    >
                      {isRTL ? cfg.label.ar : cfg.label.en} ({items.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {items.map((t) => (
                      <TodoItem
                        key={t._id}
                        todo={t}
                        projectId={projectId}
                        userId={userId}
                        isRTL={isRTL}
                        isLeader={isLeader}
                        view="list"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tip */}
        {isLeader && todos.length > 0 && (
          <p className="text-center text-xs text-gray-300 dark:text-gray-600 font-medium pb-2">
            {isRTL
              ? "اضغط على حالة العنصر لتغييرها • حرك المؤشر فوقه للتعديل أو الحذف"
              : "Click the status badge to change it • Hover for edit / delete"}
          </p>
        )}
      </div>
    </div>
  );
}
