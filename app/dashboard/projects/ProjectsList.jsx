"use client";

import ProjectCard from "../components/ProjectCard";
import { translations } from "../../../lib/translations";
import Link from "next/link";
import { useAppContext } from "../../../contexts/AppContext";
import { useGetProjects } from "../../../hooks/projects/useGetProjects";
import Loading from "../../../components/Loading";
import {
  Mail,
  CirclePlus,
  Folder,
  Users,
  Search,
  Grid,
  List,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export default function ProjectsList() {
  const { language, isRTL, userId } = useAppContext();
  const content = translations[language];
  const { data, isLoading } = useGetProjects(userId);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("leading");
  const [filters, setFilters] = useState({
    status: "all",
    sort: "newest",
  });

  const calculateProjectProgress = (project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(
      (task) => task.status === "completed"
    ).length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const leadingProjects = data?.filter(
    (proj) =>
      proj.leaderId?._id === userId ||
      proj.coLeaders?.some((u) => u._id === userId)
  );

  const participatingProjects = data?.filter(
    (proj) =>
      proj.members?.some((member) => member._id === userId) &&
      !leadingProjects?.some((leadProj) => leadProj._id === proj._id)
  );

  const filterProjects = (projects) => {
    if (!projects) return [];

    let filtered = [...projects];

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // تطبيق فلتر الحالة
    if (filters.status !== "all") {
      filtered = filtered.filter((project) => {
        if (filters.status === "active") return project.public;
        if (filters.status === "pending") return !project.public;
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
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors ${
        isRTL ? "rtl" : "ltr"
      } flex flex-col`}
    >
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Folder className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
                  {content.dashboard.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-3xl">
                  {isRTL ? "إدارة وتتبع جميع مشاريعك" : "Manage and track all your projects"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link href="/dashboard/invitations" className="flex-shrink-0">
                <button
                  className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  aria-label={content.dashboard.invitations.title}
                >
                  <Mail className="w-5 h-5" />
                </button>
              </Link>
              <Link
                href="/dashboard/createProject"
                className="flex-grow md:flex-grow-0"
              >
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-medium">
                  <CirclePlus className="w-5 h-5" />
                  {content.dashboard.quickActions.createProject}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={
                  isRTL ? "البحث في المشاريع..." : "Search projects..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="appearance-none w-full pl-3 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                >
                  <option value="all">
                    {isRTL ? "كل الحالات" : "All Statuses"}
                  </option>
                  <option value="active">{isRTL ? "نشطة" : "Active"}</option>
                  <option value="pending">
                    {isRTL ? "قيد الانتظار" : "Pending"}
                  </option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative flex-1">
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({ ...filters, sort: e.target.value })
                  }
                  className="appearance-none w-full pl-3 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                >
                  <option value="newest">{isRTL ? "الأحدث" : "Newest"}</option>
                  <option value="oldest">{isRTL ? "الأقدم" : "Oldest"}</option>
                  <option value="name">{isRTL ? "بالاسم" : "By Name"}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1.5 rounded-xl shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400" : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"}`}
                  aria-label={isRTL ? "عرض شبكي" : "Grid view"}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400" : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"}`}
                  aria-label={isRTL ? "عرض قائم" : "List view"}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Tabs List */}
          <TabsList className="grid grid-cols-2 w-full h-full max-w-2xl mx-auto mb-8 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 gap-2">
            <TabsTrigger
              value="leading"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Folder className="w-5 h-5 hidden md:block" />
              <span className="text-sm sm:text-base font-semibold text-center truncate">
                {content.dashboard.sections.leading}
              </span>
              {filteredLeadingProjects?.length > 0 && (
                <span className="text-xs font-bold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full min-w-[1.75rem] text-center data-[state=active]:bg-white/30">
                  {filteredLeadingProjects.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="participating"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Users className="w-5 h-5 hidden md:block" />
              <span className="text-sm sm:text-base font-semibold text-center truncate">
                {content.dashboard.sections.participating}
              </span>
              {filteredParticipatingProjects?.length > 0 && (
                <span className="text-xs font-bold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full min-w-[1.75rem] text-center data-[state=active]:bg-white/30">
                  {filteredParticipatingProjects.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Leading Projects Tab */}
          <TabsContent value="leading" className="mt-6">
            {filteredLeadingProjects?.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLeadingProjects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/dashboard/projects/${project._id}`}
                      className="group block"
                    >
                      <ProjectCard
                        project={{
                          title: project.title,
                          description: project.description,
                          createdAt: new Date(project.createdAt),
                          tasks: project.tasks?.length || 0,
                          status: project.public ? "active" : "pending",
                          progress: calculateProjectProgress(project),
                          deadline: project.deadline,
                          leader: project.leaderId?.name,
                        }}
                        content={content.dashboard}
                        isRTL={isRTL}
                        members={project.members?.length || 0}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 group-hover:border-blue-500 dark:group-hover:border-blue-400 hover:-translate-y-2 h-full overflow-hidden"
                        viewMode={viewMode}
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLeadingProjects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/dashboard/projects/${project._id}`}
                      className="group block"
                    >
                      <ProjectCard
                        project={{
                          title: project.title,
                          description: project.description,
                          createdAt: new Date(project.createdAt),
                          tasks: project.tasks?.length || 0,
                          status: project.public ? "active" : "pending",
                          progress: calculateProjectProgress(project),
                          deadline: project.deadline,
                          leader: project.leaderId?.name,
                        }}
                        content={content.dashboard}
                        isRTL={isRTL}
                        members={project.members?.length || 0}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-blue-500 dark:group-hover:border-blue-400 hover:scale-[1.01]"
                        viewMode={viewMode}
                      />
                    </Link>
                  ))}
                </div>
              )
            ) : searchTerm ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg py-16 px-6 text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mb-4">
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
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mb-4">
                  <Folder className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {isRTL ? "لا توجد مشاريع قيادية" : "No Leading Projects"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {isRTL
                    ? "ابدأ بإنشاء مشروع جديد لتتمكن من قيادته"
                    : "Start by creating a new project to lead"}
                </p>
                <Link href="/dashboard/createProject">
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    <CirclePlus className="w-5 h-5 inline-block mr-2" />
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
                      key={project._id}
                      href={`/dashboard/projects/${project._id}`}
                      className="group block"
                    >
                      <ProjectCard
                        project={{
                          title: project.title,
                          description: project.description,
                          createdAt: new Date(project.createdAt),
                          tasks: project.tasks?.length || 0,
                          status: project.public ? "active" : "pending",
                          progress: calculateProjectProgress(project),
                          deadline: project.deadline,
                          leader: project.leaderId?.name,
                        }}
                        content={content.dashboard}
                        isRTL={isRTL}
                        members={project.members?.length || 0}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 group-hover:border-purple-500 dark:group-hover:border-purple-400 hover:-translate-y-2 h-full overflow-hidden"
                        viewMode={viewMode}
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredParticipatingProjects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/dashboard/projects/${project._id}`}
                      className="group block"
                    >
                      <ProjectCard
                        project={{
                          title: project.title,
                          description: project.description,
                          createdAt: new Date(project.createdAt),
                          tasks: project.tasks?.length || 0,
                          status: project.public ? "active" : "pending",
                          progress: calculateProjectProgress(project),
                          deadline: project.deadline,
                          leader: project.leaderId?.name,
                        }}
                        content={content.dashboard}
                        isRTL={isRTL}
                        members={project.members?.length || 0}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-purple-500 dark:group-hover:border-purple-400 hover:scale-[1.01]"
                        viewMode={viewMode}
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
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {isRTL ? "لا توجد مشاريع مشاركة" : "No Participating Projects"}
                </h3>
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

