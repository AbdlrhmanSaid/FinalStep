"use client";

import ProjectCard from "../components/ProjectCard";
import EmptyState from "../components/EmptyState";
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
  Calendar,
  Flag,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../@/components/ui/tabs";

export default function ProjectsList() {
  const { language, isRTL, userId } = useAppContext();
  const content = translations[language];
  const { data, isLoading } = useGetProjects(userId);
  console.log(data);
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
      className={`min-h-screen bgMain transition-colors ${
        isRTL ? "rtl" : "ltr"
      } flex flex-col`}
    >
      {/* Header Section */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto flex sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Folder className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {content.dashboard.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 w-fit sm:w-auto">
            <Link href="/dashboard/invitations" className="flex-shrink-0">
              <button
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={content.dashboard.invitations.title}
              >
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </Link>
            <Link
              href="/dashboard/createProject"
              className="flex-grow sm:flex-grow-0"
            >
              <button className="bg-blue-600 flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-colors">
                <CirclePlus className="w-5 h-5" />
                {content.dashboard.quickActions.createProject}
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={
                isRTL ? "البحث في المشاريع..." : "Search projects..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">{isRTL ? "الأحدث" : "Newest"}</option>
                <option value="oldest">{isRTL ? "الأقدم" : "Oldest"}</option>
                <option value="name">{isRTL ? "بالاسم" : "By Name"}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${viewMode === "grid" ? "bg-white dark:bg-gray-800 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                aria-label={isRTL ? "عرض شبكي" : "Grid view"}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${viewMode === "list" ? "bg-white dark:bg-gray-800 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                aria-label={isRTL ? "عرض قائم" : "List view"}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger
              value="leading"
              className="flex items-center justify-center gap-2 min-w-0"
            >
              <Folder className="w-4 h-4 hidden md:block" />
              <span className="block text-xs sm:text-sm md:text-base text-center">
                {content.dashboard.sections.leading}
              </span>
              {filteredLeadingProjects?.length > 0 && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                  {filteredLeadingProjects.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="participating"
              className="flex items-center justify-center gap-2 min-w-0"
            >
              <Users className="w-4 h-4 hidden md:block" />
              <span className="block text-xs sm:text-sm md:text-base text-center">
                {content.dashboard.sections.participating}
              </span>
              {filteredParticipatingProjects?.length > 0 && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                  {filteredParticipatingProjects.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Leading Projects Tab */}
          <TabsContent value="leading">
            {filteredLeadingProjects?.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLeadingProjects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/dashboard/projects/${project._id}`}
                      className="group"
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
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-blue-500 dark:group-hover:border-blue-400 hover:-translate-y-1"
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
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-blue-500 dark:group-hover:border-blue-400"
                        viewMode={viewMode}
                      />
                    </Link>
                  ))}
                </div>
              )
            ) : searchTerm ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-12 px-6 text-center">
                <Search className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {isRTL
                    ? `لا توجد نتائج للبحث عن "${searchTerm}" في المشاريع القيادية`
                    : `No results found for "${searchTerm}" in leading projects`}
                </p>
              </div>
            ) : (
              <EmptyState
                content={content.dashboard}
                isRTL={isRTL}
                icon={<Folder className="w-10 h-10 text-gray-400 mx-auto" />}
                title={isRTL ? "لا توجد مشاريع قيادية" : "No leading projects"}
                description={
                  isRTL
                    ? "يمكنك إنشاء مشروع جديد بالضغط على الزر أعلاه"
                    : "You can create a new project by clicking the button above"
                }
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-12 px-6"
              />
            )}
          </TabsContent>

          {/* Participating Projects Tab */}
          <TabsContent value="participating">
            {filteredParticipatingProjects?.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredParticipatingProjects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/dashboard/projects/${project._id}`}
                      className="group"
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
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-blue-500 dark:group-hover:border-blue-400 hover:-translate-y-1"
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
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-blue-500 dark:group-hover:border-blue-400"
                        viewMode={viewMode}
                      />
                    </Link>
                  ))}
                </div>
              )
            ) : searchTerm ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-12 px-6 text-center">
                <Search className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {isRTL
                    ? `لا توجد نتائج للبحث عن "${searchTerm}" في المشاريع المشاركة`
                    : `No results found for "${searchTerm}" in participating projects`}
                </p>
              </div>
            ) : (
              <EmptyState
                content={content.dashboard}
                isRTL={isRTL}
                icon={<Users className="w-10 h-10 text-gray-400 mx-auto" />}
                title={
                  isRTL ? "لا توجد مشاريع مشاركة" : "No participating projects"
                }
                description={
                  isRTL
                    ? "سيظهر هنا المشاريع التي تنضم إليها عندما تتم دعوتك"
                    : "Projects you join will appear here when you're invited"
                }
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-12 px-6"
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
