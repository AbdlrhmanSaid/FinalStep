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
      <header className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-lg mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Folder className="w-8 h-8 text-blue-500" />
            {content.dashboard.title}
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/invitations">
              <button
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="View Invitations"
              >
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </Link>
            <Link href="/dashboard/createProject">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
                <CirclePlus className="w-5 h-5" />
                {content.dashboard.createProject}
              </button>
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <section className="mb-12">
          <h2
            className={`text-2xl font-bold text-gray-900 dark:text-white mb-6 ${
              isRTL ? "text-right" : "text-left"
            } flex items-center gap-2`}
          >
            <Folder className="w-6 h-6 text-yellow-500" />
            {content.dashboard.sections.leading}
          </h2>
          {leadingProjects?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadingProjects.map((project) => (
                <Link
                  key={project._id}
                  href={`/dashboard/project/${project._id}`}
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
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              content={content.dashboard}
              isRTL={isRTL}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-12"
            />
          )}
        </section>

        <section>
          <h2
            className={`text-2xl font-bold text-gray-900 dark:text-white mb-6 ${
              isRTL ? "text-right" : "text-left"
            } flex items-center gap-2`}
          >
            <Users className="w-6 h-6 text-blue-500" />
            {content.dashboard.sections.participating}
          </h2>
          {participatingProjects?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {participatingProjects.map((project) => (
                <Link
                  href={`/dashboard/project/${project._id}`}
                  key={project._id}
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
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              content={content.dashboard}
              isRTL={isRTL}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-12"
            />
          )}
        </section>
      </main>
    </div>
  );
}
