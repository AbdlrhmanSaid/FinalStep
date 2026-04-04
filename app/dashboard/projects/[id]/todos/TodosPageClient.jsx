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
} from "lucide-react";

import { STATUS } from "./components/constants";
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
        sectionId: newSectionId,
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
            className="mb-10 bg-white dark:bg-gray-800/80 p-5 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-500/5 flex flex-col gap-4"
          >
            <div className="flex gap-2">
              <input
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder={isRTL ? "أضف عنصراً جديداً..." : "Add new item..."}
                className="flex-1 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-5 py-3 text-sm font-bold text-gray-800 dark:text-white transition-all"
              />
              <button
                type="submit"
                disabled={isAdding || !newText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {isRTL ? "إضافة" : "Add"}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 px-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-gray-400">
                  {isRTL ? "النوع:" : "Type:"}
                </span>
                <TypeDropdown
                  currentType={newType}
                  onSelect={setNewType}
                  isRTL={isRTL}
                />
              </div>

              <div className="flex items-center gap-2 border-s border-gray-100 dark:border-gray-700 ps-4">
                <span className="text-[10px] font-black uppercase text-gray-400">
                  {isRTL ? "القسم:" : "Section:"}
                </span>
                <SectionDropdown
                  currentId={newSectionId}
                  sections={sections}
                  onSelect={setNewSectionId}
                  isRTL={isRTL}
                />
              </div>

              <div className="ms-auto flex bg-gray-100/80 dark:bg-gray-900/50 p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Content */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {Object.keys(STATUS).map((status) => (
              <TodoColumn
                key={status}
                status={status}
                todos={todos.filter((t) => t.status === status)}
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
            {todos.length === 0 ? (
              <div className="py-20 text-center opacity-40 font-black uppercase tracking-widest text-sm">
                {isRTL ? "لا يوجد عناصر" : "No Roadmap items"}
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
