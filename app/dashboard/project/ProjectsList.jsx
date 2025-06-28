"use client";

import ProjectCard from "../components/ProjectCard";
import EmptyState from "../components/EmptyState";
import { translations } from "../../../lib/translations";
import Link from "next/link";
import { useAppContext } from "../../../contexts/AppContext";
import { useGetProjects } from "../../../hooks/projects/useGetProjects";
import Loading from "../../../components/Loading";
import { Bell, CirclePlus, Folder, Users } from "lucide-react";

export default function ProjectsList() {
  const { language, isRTL, userId } = useAppContext();
  const content = translations[language];
  const { data, isLoading } = useGetProjects();

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
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Folder className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {content.dashboard.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/dashboard/invitations" className="flex-shrink-0">
              <button
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={content.dashboard.invitations}
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </Link>
            <Link
              href="/dashboard/createProject"
              className="flex-grow sm:flex-grow-0"
            >
              <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors w-full sm:w-auto">
                <CirclePlus className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Leading Projects Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3`}
            >
              <Folder className="w-6 h-6 text-yellow-500" />
              {content.dashboard.sections.leading}
              {leadingProjects?.length > 0 && (
                <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                  {leadingProjects.length}
                </span>
              )}
            </h2>
          </div>

          {leadingProjects?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadingProjects.map((project) => (
                <Link
                  key={project._id}
                  href={`/dashboard/project/${project._id}`}
                  className="group"
                >
                  <ProjectCard
                    project={{
                      title: project.title,
                      description: project.description,
                      createdAt: new Date(
                        project.createdAt
                      ).toLocaleDateString(),
                      tasks: project.tasks?.length || 0,
                      status: project.public ? "active" : "pending",
                    }}
                    content={content.dashboard}
                    isRTL={isRTL}
                    members={project.members?.length || 0}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-blue-500 dark:group-hover:border-blue-400"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              content={content.dashboard}
              isRTL={isRTL}
              icon={<Folder className="w-10 h-10 text-gray-400 mx-auto" />}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-12 px-6"
            />
          )}
        </section>

        {/* Participating Projects Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3`}
            >
              <Users className="w-6 h-6 text-blue-500" />
              {content.dashboard.sections.participating}
              {participatingProjects?.length > 0 && (
                <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                  {participatingProjects.length}
                </span>
              )}
            </h2>
          </div>

          {participatingProjects?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {participatingProjects.map((project) => (
                <Link
                  href={`/dashboard/project/${project._id}`}
                  key={project._id}
                  className="group"
                >
                  <ProjectCard
                    project={{
                      title: project.title,
                      description: project.description,
                      createdAt: new Date(
                        project.createdAt
                      ).toLocaleDateString(),
                      tasks: project.tasks?.length || 0,
                      status: project.public ? "active" : "pending",
                    }}
                    content={content.dashboard}
                    isRTL={isRTL}
                    members={project.members?.length || 0}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-blue-500 dark:group-hover:border-blue-400"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              content={content.dashboard}
              isRTL={isRTL}
              icon={<Users className="w-10 h-10 text-gray-400 mx-auto" />}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-12 px-6"
            />
          )}
        </section>
      </main>
    </div>
  );
}
