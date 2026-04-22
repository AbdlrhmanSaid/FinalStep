"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function TaskDependencySelector({
  tasks,
  value,
  onChange,
  isRTL,
  availableSections = [],
}) {
  const [open, setOpen] = useState(false);

  // value is expected to be an array of task IDs
  const safeValue = Array.isArray(value) ? value : [];

  const handleSelect = (taskId) => {
    if (safeValue.includes(taskId)) {
      onChange(safeValue.filter((id) => id !== taskId));
    } else {
      onChange([...safeValue, taskId]);
    }
  };

  const handleRemove = (taskId, e) => {
    e.stopPropagation();
    onChange(safeValue.filter((id) => id !== taskId));
  };

  // Group tasks by section
  const sectionGroups = {};
  const noSectionTasks = [];

  tasks.forEach((t) => {
    let sTitle = null;
    if (t.sectionAssignments?.[0]?.sectionId) {
      const secId =
        typeof t.sectionAssignments[0].sectionId === "object"
          ? t.sectionAssignments[0].sectionId._id
          : t.sectionAssignments[0].sectionId;
      const secObj = availableSections.find(
        (s) => String(s._id) === String(secId)
      );
      if (secObj) sTitle = secObj.title;
    }
    if (!sTitle && t.sectionId) {
      const secId =
        typeof t.sectionId === "object" ? t.sectionId._id : t.sectionId;
      const secObj = availableSections.find(
        (s) => String(s._id) === String(secId)
      );
      if (secObj) sTitle = secObj.title;
    }

    if (sTitle) {
      if (!sectionGroups[sTitle]) sectionGroups[sTitle] = [];
      sectionGroups[sTitle].push(t);
    } else {
      noSectionTasks.push(t);
    }
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className="w-full flex items-center justify-between px-4 py-2.5 min-h-[44px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold transition-all hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex flex-wrap gap-1.5 items-center max-w-[90%] overflow-hidden">
            {safeValue.length === 0 ? (
              <span className="text-gray-400">
                {isRTL ? "لا يعتمد على أي مهمة" : "No dependency"}
              </span>
            ) : (
              safeValue.map((taskId) => {
                const taskObj = tasks.find((t) => t._id === taskId);
                if (!taskObj) return null;
                return (
                 <span
                    key={taskId}
                    className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md text-xs font-bold"
                  >
                    <span className="truncate max-w-[120px]">{taskObj.title}</span>
                    <span
                      onClick={(e) => handleRemove(taskId, e)}
                      className="cursor-pointer hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </span>
                );
              })
            )}
          </div>
          <ChevronsUpDown className="w-4 h-4 text-gray-400 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 w-[var(--radix-popover-trigger-width)] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden z-50">
        <Command className="bg-transparent text-gray-800 dark:text-gray-200" dir={isRTL ? "rtl" : "ltr"}>
          <CommandInput
            placeholder={isRTL ? "ابحث عن مهمة..." : "Search task..."}
            className="border-b border-gray-100 dark:border-gray-700/50 h-11 px-3 text-sm focus:outline-none"
          />
          <CommandList className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            <CommandEmpty className="py-6 text-center text-sm text-gray-400">
               {isRTL ? "لم يتم العثور على أي مهمة." : "No tasks found."}
            </CommandEmpty>

            {Object.entries(sectionGroups).map(([secTitle, secTasks]) => (
              <CommandGroup key={secTitle} heading={secTitle} className="text-gray-500 dark:text-gray-400 font-bold px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-black [&_[cmdk-group-heading]]:text-gray-400 dark:[&_[cmdk-group-heading]]:text-gray-500">
                {secTasks.map((t) => {
                  const isSelected = safeValue.includes(t._id);
                  return (
                    <CommandItem
                      key={t._id}
                      value={t.title + t._id} // so cmdk can search both
                      onSelect={() => handleSelect(t._id)}
                      className={cn(
                        "cursor-pointer flex items-center gap-2 px-2 py-2 rounded-xl transition-colors outline-none",
                        "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                        "data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-700"
                      )}
                    >
                      <div
                        className={cn(
                          "mr-2 ml-2 flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors shrink-0",
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-300 dark:border-gray-600 bg-transparent text-transparent"
                        )}
                      >
                        <Check className={cn("h-4 w-4")} />
                      </div>
                      <span>{t.title}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}

            {noSectionTasks.length > 0 && (
              <CommandGroup heading={isRTL ? "مهام عامة" : "General Tasks"} className="text-gray-500 dark:text-gray-400 font-bold px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-black [&_[cmdk-group-heading]]:text-gray-400 dark:[&_[cmdk-group-heading]]:text-gray-500">
                {noSectionTasks.map((t) => {
                  const isSelected = safeValue.includes(t._id);
                  return (
                    <CommandItem
                      key={t._id}
                      value={t.title + t._id}
                      onSelect={() => handleSelect(t._id)}
                      className={cn(
                        "cursor-pointer flex items-center gap-2 px-2 py-2 rounded-xl transition-colors outline-none",
                        "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                        "data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-700"
                      )}
                    >
                      <div
                        className={cn(
                          "mr-2 ml-2 flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors shrink-0",
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-300 dark:border-gray-600 bg-transparent text-transparent"
                        )}
                      >
                        <Check className={cn("h-3 w-3")} />
                      </div>
                      <span>{t.title}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
