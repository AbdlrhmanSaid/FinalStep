import {
  Clock,
  Zap,
  CheckCircle2,
  Flag,
  Users,
  ClipboardList,
} from "lucide-react";

export const STATUS = {
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
    label: { ar: "منتهي", en: "Completed" },
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    dot: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-800",
    hover: "hover:border-emerald-300 dark:hover:border-emerald-700",
    progressColor: "bg-emerald-500",
  },
};

export const TYPES = {
  target: {
    label: { ar: "هدف", en: "Target" },
    icon: Zap,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/40",
  },
  task: {
    label: { ar: "مهمة", en: "Task" },
    icon: ClipboardList,
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-900/40",
  },
  milestone: {
    label: { ar: "مرحلة", en: "Milestone" },
    icon: Flag,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/40",
  },
  meeting: {
    label: { ar: "اجتماع", en: "Meeting" },
    icon: Users,
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-900/40",
  },
};
