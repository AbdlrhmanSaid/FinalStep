"use client";

import { useState, useEffect } from "react";
import { useSearch } from "../../../hooks/search/useSearch";
import { useAppContext } from "../../../contexts/AppContext";
import { translations } from "../../../lib/translations";
import ProjectCard from "../components/ProjectCard";
import Link from "next/link";
import Loading from "../../../components/Loading";
import { Search, Users, Folder, AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDebounce } from "../../../hooks/useDebounce";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export default function SearchContent() {
  const { language, isRTL } = useAppContext();
  const content = translations[language].dashboard.searchPage;
  const commonContent = translations[language].dashboard;

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const [activeTab, setActiveTab] = useState("all");

  const { data, isLoading, isError } = useSearch(debouncedSearchTerm);

  const [viewMode, setViewMode] = useState("grid");

  const dateLocale = language === "ar" ? ar : enUS;

  const users = data?.users || [];
  const projects = data?.projects || [];

  const calculateProjectProgress = (project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(
      (task) => task.status === "completed",
    ).length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  return (
    <div
      className={`min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-[14px] md:text-[24px] font-bold text-gray-800 dark:text-white">
                {content.title}
              </h1>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              autoFocus
              placeholder={content.placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-3 py-2 text-lg border-2 border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:placeholder-gray-400"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 rtl:left-4 rtl:right-auto">
                <span className="text-sm text-gray-400 dark:text-gray-300 animate-pulse font-medium">
                  {isRTL ? "يتم البحث..." : "Searching..."}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {debouncedSearchTerm.trim().length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
            <Search className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg">{content.placeholder}</p>
          </div>
        ) : isLoading && users.length === 0 && projects.length === 0 ? (
          <div className="py-20 flex justify-center text-gray-500 font-medium">
            <p className="animate-pulse">
              {isRTL ? "يتم البحث..." : "Searching..."}
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <AlertCircle className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">{content.error}</p>
          </div>
        ) : users.length === 0 && projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
            <Search className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg">{content.noResults}</p>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full h-full"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <TabsList className="grid h-full grid-cols-3 max-w-2xl mx-auto mb-8 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow border border-gray-200 dark:border-gray-700 gap-2">
              <TabsTrigger
                value="all"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="font-semibold">{content.all}</span>
                <span className="text-xs bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full">
                  {users.length + projects.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Users className="w-4 h-4 hidden sm:block" />
                <span className="font-semibold">{content.users}</span>
                <span className="text-xs bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full">
                  {users.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Folder className="w-4 h-4 hidden sm:block" />
                <span className="font-semibold">{content.projects}</span>
                <span className="text-xs bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full">
                  {projects.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-10">
              {users.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-white">
                    <Users className="w-5 h-5 text-blue-500" />
                    {content.users}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.slice(0, 6).map((u) => (
                      <UserSearchCard
                        key={u._id}
                        user={u}
                        content={content}
                        isRTL={isRTL}
                      />
                    ))}
                  </div>
                  {users.length > 6 && (
                    <button
                      onClick={() => setActiveTab("users")}
                      className="mt-4 text-blue-600 font-medium hover:underline flex items-center gap-1"
                    >
                      {activeTab !== "users"
                        ? `+ ${users.length - 6} more`
                        : ""}
                    </button>
                  )}
                </section>
              )}

              {projects.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-white">
                    <Folder className="w-5 h-5 text-purple-500" />
                    {content.projects}
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.slice(0, 6).map((project) => (
                      <Link
                        key={project._id}
                        href={`/dashboard/projects/${project._id}`}
                        className="group block h-full"
                      >
                        <ProjectCard
                          project={{
                            title: project.title,
                            description: project.description,
                            createdAt: new Date(project.createdAt),
                            tasks: project.tasks?.length || 0,
                            status:
                              project.status === "finished"
                                ? "finished"
                                : project.public
                                  ? "active"
                                  : "pending",
                            progress: calculateProjectProgress(project),
                            deadline: project.deadline,
                            leader: project.leaderId?.name || "Unknown",
                          }}
                          content={commonContent}
                          isRTL={isRTL}
                          members={project.members?.length || 0}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 group-hover:border-purple-500 hover:-translate-y-1 h-full overflow-hidden"
                          viewMode="grid"
                        />
                      </Link>
                    ))}
                  </div>
                  {projects.length > 6 && (
                    <button
                      onClick={() => setActiveTab("projects")}
                      className="mt-4 text-purple-600 font-medium hover:underline flex items-center gap-1"
                    >
                      {activeTab !== "projects"
                        ? `+ ${projects.length - 6} more`
                        : ""}
                    </button>
                  )}
                </section>
              )}
            </TabsContent>

            <TabsContent value="users">
              {users.length === 0 ? (
                <p className="text-center py-10 text-gray-500">
                  {content.noResults}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((u) => (
                    <UserSearchCard
                      key={u._id}
                      user={u}
                      content={content}
                      isRTL={isRTL}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects">
              {projects.length === 0 ? (
                <p className="text-center py-10 text-gray-500">
                  {content.noResults}
                </p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/dashboard/projects/${project._id}`}
                      className="group block h-full"
                    >
                      <ProjectCard
                        project={{
                          title: project.title,
                          description: project.description,
                          createdAt: new Date(project.createdAt),
                          tasks: project.tasks?.length || 0,
                          status:
                            project.status === "finished"
                              ? "finished"
                              : project.public
                                ? "active"
                                : "pending",
                          progress: calculateProjectProgress(project),
                          deadline: project.deadline,
                          leader: project.leaderId?.name || "Unknown",
                        }}
                        content={commonContent}
                        isRTL={isRTL}
                        members={project.members?.length || 0}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 group-hover:border-purple-500 hover:-translate-y-1 h-full overflow-hidden"
                        viewMode="grid"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

function UserSearchCard({ user, content, isRTL }) {
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <Link href={`/dashboard/user/${user._id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 block h-full">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center shrink-0 border-2 border-white dark:border-gray-800 shadow-sm">
            <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {getInitials(user.name || user.email?.split("@")[0])}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {user.name || user.email?.split("@")[0]}
            </h3>
            {user.title && (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {user.title}
              </p>
            )}
            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
              {content.viewProfile} &rarr;
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
