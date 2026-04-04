"use client";

import { STATUS } from "./constants";
import TodoItem from "./TodoItem";

export default function TodoColumn({
  status,
  todos,
  projectId,
  userId,
  isRTL,
  isLeader,
  sections,
}) {
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
        <span className={`text-[11px] font-black uppercase tracking-wider ${cfg.color}`}>
          {isRTL ? cfg.label.ar : cfg.label.en}
        </span>
        <span className="ms-auto text-[10px] font-black bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
          {todos.length}
        </span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {todos.length === 0 ? (
          <div
            className={`py-8 text-center text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest border border-dashed border-gray-100 dark:border-gray-800/50 rounded-2xl bg-gray-50/30 dark:bg-gray-900/10`}
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
              sections={sections}
              view="grid"
            />
          ))
        )}
      </div>
    </div>
  );
}
