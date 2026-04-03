"use client";

import ProjectCard from "../components/ProjectCard";
import { translations } from "@/lib/translations";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import { useGetProjects } from "@/hooks/projects/useGetProjects";
import Loading from "@/components/Loading";
import {
  Mail,
  Plus,
  Folder,
  Search,
  Grid,
  List,
  RefreshCw,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ProjectsList() {
  const { language, isRTL, userId } = useAppContext();
  const content = translations[language];
  const { data, isLoading, refetch, isRefetching } = useGetProjects(userId);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("leading");
  const [filters, setFilters] = useState({
    status: "all",
    sort: "newest",
  });

  const uniqueProjects = data
    ? Array.from(new Map(data.map((p) => [p._id, p])).values())
    : [];

  const leadingProjects = uniqueProjects.filter(
    (proj) =>
      proj.leaderId?._id?.toString() === userId?.toString() ||
      proj.coLeaders?.some((u) => u._id?.toString() === userId?.toString()),
  );

  const participatingProjects = uniqueProjects.filter(
    (proj) =>
      proj.members?.some(
        (member) => member._id?.toString() === userId?.toString(),
      ) && !leadingProjects?.some((leadProj) => leadProj._id === proj._id),
  );

  const filterProjects = (projects) => {
    if (!projects) return [];

    let filtered = [...projects];

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((project) => {
        if (filters.status === "open") return project.status !== "finished";
        if (filters.status === "finished") return project.status === "finished";
        return true;
      });
    }

    if (filters.sort === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sort === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (filters.sort === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  };

  const filteredLeadingProjects = filterProjects(leadingProjects);
  const filteredParticipatingProjects = filterProjects(participatingProjects);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className={`min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors ${
        isRTL ? "rtl" : "ltr"
      } flex flex-col`}
    >
      {/* Header Section */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                <span>{isRTL ? "لوحة التحكم" : "Dashboard"}</span>
                <span className="mx-2 text-gray-300 dark:text-gray-700">/</span>
                <span className="text-gray-900 dark:text-white font-bold">
                  {isRTL ? "المشاريع" : "Projects"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => refetch()}
                disabled={isRefetching}
                className="p-2 text-gray-400 hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors"
                title={isRTL ? "تحديث" : "Refresh"}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
                />
              </button>

              <Link href="/dashboard/createProject">
                <button className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm shadow-blue-500/20">
                  <Plus className="w-4 h-4" />
                  {content.dashboard.quickActions.createProject}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero & Metrics */}
      <section className="bg-white dark:bg-gray-900 py-8 border-b border-gray-100 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight ">
                {isRTL ? "مشاريعك" : "Your Projects"}
                <span className="ml-3 text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full align-middle mx-2">
                  {data?.length || 0}
                </span>
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-xl text-sm leading-relaxed">
                {isRTL
                  ? "تتبع تقدم مشاريعك، تواصل مع فريقك، وحقق أهدافك في مكان واحد منظم."
                  : "Track progress, collaborate with your team, and achieve goals in one organized workspace."}
              </p>
            </div>

            <div className="flex items-center gap-8 py-2 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                  {isRTL ? "نشط" : "Active Tasks"}
                </span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400 leading-none">
                  {uniqueProjects.reduce(
                    (acc, p) =>
                      acc +
                      (p.tasks?.filter((t) => t.status !== "completed")
                        .length || 0),
                    0,
                  ) || 0}
                </span>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                  {isRTL ? "إنجاز" : "Completion"}
                </span>
                <span className="text-xl font-black text-green-600 dark:text-green-400 leading-none">
                  {uniqueProjects.length > 0
                    ? Math.round(
                        (uniqueProjects.filter((p) => p.status === "finished")
                          .length /
                          uniqueProjects.length) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workbench Toolbar */}
      <section className="bg-gray-50/50 dark:bg-gray-900/50 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Tabs (Segmented Control) */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full lg:w-auto"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl h-10 border border-gray-200 dark:border-gray-700">
                <TabsTrigger
                  value="leading"
                  className="rounded-lg px-6 text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                >
                  {content.dashboard.sections.leading}
                </TabsTrigger>
                <TabsTrigger
                  value="participating"
                  className="rounded-lg px-6 text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400"
                >
                  {content.dashboard.sections.participating}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={isRTL ? "البحث..." : "Search..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="dark:placeholder:text-white w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
              </div>

              {/* View Switcher */}
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-400"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-400"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grow w-full">
        <Tabs value={activeTab} className="w-full">
          {/* Leading Projects Tab */}
          <TabsContent value="leading" className="mt-6">
            {filteredLeadingProjects?.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLeadingProjects.map((project) => (
                    <Link
                      key={`lead-grid-${project._id}`}
                      href={`/dashboard/projects/${project._id}`}
                      className="group block"
                    >
                      <ProjectCard
                        project={project}
                        content={content.dashboard}
                        isRTL={isRTL}
                        className="h-full"
                        viewMode={viewMode}
                        currentUserId={userId}
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLeadingProjects.map((project) => (
                    <Link
                      key={`lead-list-${project._id}`}
                      href={`/dashboard/projects/${project._id}`}
                      className="group block"
                    >
                      <ProjectCard
                        project={project}
                        content={content.dashboard}
                        isRTL={isRTL}
                        className="h-full"
                        viewMode={viewMode}
                        currentUserId={userId}
                      />
                    </Link>
                  ))}
                </div>
              )
            ) : searchTerm ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg py-16 px-6 text-center">
                <div className="mx-auto w-20 h-20 bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                </div>
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {isRTL
                    ? `لا توجد نتائج لـ "${searchTerm}"`
                    : `No results for "${searchTerm}"`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isRTL ? "جرب كلمات مفتاحية أخرى" : "Try different keywords"}
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg py-16 px-6 text-center">
                <div className="mx-auto w-20 h-20 bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mb-4">
                  <Folder className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {isRTL ? "لا توجد مشاريع قيادية" : "No Leading Projects"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {isRTL
                    ? "ابدأ بإنشاء مشروع جديد لتتمكن من قيادته"
                    : "Start by creating a new project to lead"}
                </p>
                <Link href="/dashboard/createProject">
                  <button className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    <Plus className="w-5 h-5 inline-block mr-2" />
                    {content.dashboard.quickActions.createProject}
                  </button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Participating Projects Tab */}
          <TabsContent value="participating" className="mt-6">
            {filteredParticipatingProjects?.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredParticipatingProjects.map((project) => (
                    <Link
                      key={`part-grid-${project._id}`}
                      href={`/dashboard/projects/${project._id}`}
                      className="group block"
                    >
                      <ProjectCard
                        project={project}
                        content={content.dashboard}
                        isRTL={isRTL}
                        className="h-full"
                        viewMode={viewMode}
                        currentUserId={userId}
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredParticipatingProjects.map((project) => (
                    <Link
                      key={`part-list-${project._id}`}
                      href={`/dashboard/projects/${project._id}`}
                      className="group block"
                    >
                      <ProjectCard
                        project={project}
                        content={content.dashboard}
                        isRTL={isRTL}
                        className="h-full"
                        viewMode={viewMode}
                        currentUserId={userId}
                      />
                    </Link>
                  ))}
                </div>
              )
            ) : searchTerm ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg py-16 px-6 text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-purple-500 dark:text-purple-400" />
                </div>
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {isRTL
                    ? `لا توجد نتائج لـ "${searchTerm}"`
                    : `No results for "${searchTerm}"`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isRTL ? "جرب كلمات أخرى" : "Try different keywords"}
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg py-16 px-6 text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-10 h-10 text-purple-500 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {isRTL
                    ? "لا توجد مشاريع مشاركة"
                    : "No Participating Projects"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isRTL
                    ? "ستظهر المشاريع التي تنضم إليها هنا بعد قبول الدعوات"
                    : "Projects you join will appear here after accepting invitations"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
