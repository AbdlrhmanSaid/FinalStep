"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import { useGetProject } from "@/hooks/projects/useGetProjects";
import {
  useProjectTodos,
  useAddTodo,
} from "@/hooks/projects/useProjectTodos";
import { useGetSections } from "@/hooks/sections/useGetSections";
import Loading from "@/components/Loading";
import ProjectPageHeader from "../components/ProjectPageHeader";
import {
  Plus,
  LayoutGrid,
  List,
  Loader2,
  Check,
  ClipboardList,
  ChevronDown,
} from "lucide-react";

import { STATUS, TYPES } from "./components/constants";
import { TypeDropdown, SectionDropdown } from "./components/TodoDropdowns";
import TodoItem from "./components/TodoItem";
import TodoColumn from "./components/TodoColumn";

export default function TodosPageClient() {
  const { id: projectId } = useParams();
  const { userId, isRTL } = useAppContext();
  const { data: project, isLoading: loadingProject } = useGetProject(projectId);
  const { data: todos = [], isLoading: loadingTodos } =
    useProjectTodos(projectId);
  const { data: sections = [], isLoading: loadingSections } =
    useGetSections(projectId);
  const { mutate: addTodo, isPending: isAdding } = useAddTodo(projectId);

  const [newText, setNewText] = useState("");
  const [newStatus, setNewStatus] = useState("todo");
  const [newSectionId, setNewSectionId] = useState(null);
  const [newType, setNewType] = useState("target");
  const [view, setView] = useState("grid"); // "grid" | "list"

  const [filterSection, setFilterSection] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const isLeader =
    project?.leaderId?._id === userId ||
    project?.coLeaders?.some((u) => u._id === userId);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    addTodo(
      {
        text: newText.trim(),
        status: newStatus,
        sectionId: newSectionId === "all" ? null : newSectionId,
        type: newType,
        userId,
      },
      {
        onSuccess: () => {
          setNewText("");
        },
      },
    );
  };

  const filteredTodos = todos.filter((t) => {
    if (filterSection !== "all") {
      if (filterSection === "none" && t.sectionId != null) return false;
      if (filterSection !== "none" && t.sectionId !== filterSection) return false;
    }
    if (filterType !== "all" && t.type !== filterType) return false;
    return true;
  });

  if (loadingProject || loadingTodos || loadingSections) return <Loading />;

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <ProjectPageHeader
        projectId={projectId}
        projectTitle={project?.title}
        icon={ClipboardList}
        iconBg="bg-linear-to-br from-blue-500 to-indigo-600"
        label={isRTL ? "خطة العمل الاستراتيجية" : "Strategic Roadmap"}
        title={isRTL ? "إدارة العناصر" : "Roadmap Items"}
        isRTL={isRTL}
      />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Add Field */}
        {isLeader && (
          <form
            onSubmit={handleAdd}
            className="mb-6 bg-white dark:bg-gray-800/80 p-4 sm:p-5 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-500/5 flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder={isRTL ? "أضف عنصراً جديداً..." : "Add new item..."}
                className="flex-1 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-800 dark:text-white transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={isAdding || !newText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3.5 sm:py-0 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <Loader2 className="w-5 h-5 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
                )}
                <span className="inline sm:hidden lg:inline">
                  {isRTL ? "إضافة عنصر" : "Add Item"}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-gray-400">
                  {isRTL ? "تعيين النوع:" : "Set Type:"}
                </span>
                <TypeDropdown
                  currentType={newType}
                  onSelect={setNewType}
                  isRTL={isRTL}
                />
              </div>

              <div className="flex items-center gap-2 border-none sm:border-s sm:border-gray-100 sm:dark:border-gray-700 sm:ps-6">
                <span className="text-[10px] font-black uppercase text-gray-400">
                  {isRTL ? "تعيين القسم:" : "Set Section:"}
                </span>
                <SectionDropdown
                  currentId={newSectionId}
                  sections={sections}
                  onSelect={setNewSectionId}
                  isRTL={isRTL}
                />
              </div>
            </div>
          </form>
        )}

        {/* Filters and View Toggle */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800/50 px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 shrink-0">
                {isRTL ? "تصفية بالنوع:" : "Filter Type:"}
              </span>
              <div className="relative flex-1 sm:w-32">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`appearance-none w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-xl py-2 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                    isRTL ? "pr-3 pl-8" : "pl-3 pr-8"
                  }`}
                >
                  <option value="all">{isRTL ? "الكل" : "All"}</option>
                  {Object.entries(TYPES).map(([k, t]) => (
                    <option key={k} value={k}>
                      {isRTL ? t.label.ar : t.label.en}
                    </option>
                  ))}
                </select>
                <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? "left-0 pl-2.5" : "right-0 pr-2.5"} flex items-center`}>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 shrink-0">
                {isRTL ? "تصفية بالقسم:" : "Filter Sec:"}
              </span>
              <div className="relative flex-1 sm:w-36">
                <select
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                  className={`appearance-none w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-xl py-2 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                    isRTL ? "pr-3 pl-8" : "pl-3 pr-8"
                  }`}
                >
                  <option value="all">{isRTL ? "الكل" : "All Sections"}</option>
                  <option value="none">{isRTL ? "بدون قسم" : "No Section"}</option>
                  {sections.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? "left-0 pl-2.5" : "right-0 pr-2.5"} flex items-center`}>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 bg-gray-100/80 dark:bg-gray-900/50 p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 ml-auto sm:ml-0 rtl:mr-auto rtl:ml-0">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                view === "grid"
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`p-1.5 rounded-lg transition-all ${
                view === "list"
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {Object.keys(STATUS).map((status) => (
              <TodoColumn
                key={status}
                status={status}
                todos={filteredTodos.filter((t) => t.status === status)}
                projectId={projectId}
                userId={userId}
                isRTL={isRTL}
                isLeader={isLeader}
                sections={sections}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-w-3xl mx-auto">
            {filteredTodos.length === 0 ? (
              <div className="py-20 text-center opacity-40 font-black uppercase tracking-widest text-sm">
                {isRTL ? "لا توجد عناصر تطابق الفلتر" : "No Roadmap items match"}
              </div>
            ) : (
              filteredTodos.map((t) => (
                <TodoItem
                  key={t._id}
                  todo={t}
                  projectId={projectId}
                  userId={userId}
                  isRTL={isRTL}
                  isLeader={isLeader}
                  sections={sections}
                  view="list"
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
