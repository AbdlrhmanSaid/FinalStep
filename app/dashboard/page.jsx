"use client";

import { Plus } from "lucide-react";
import ProjectCard from "./components/ProjectCard";
import EmptyState from "./components/EmptyState";
import { translations } from "../../lib/translations";
import Link from "next/link";
import { useAppContext } from "../../contexts/AppContext";
import { useGetProjects } from "../../hooks/projects/useGetProjects";
import Loading from "../../components/Loading";

export default function Dashboard() {
  const { language, isRTL, userId } = useAppContext();
  const content = translations[language];
  const { data, isLoading } = useGetProjects();

  const leadingProjects = data?.filter(
    (proj) => proj.leaderId === userId || proj.members.includes(userId)
  );
  const participatingProjects = data?.filter((proj) =>
    proj.members.includes(userId)
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className={`min-h-screen bg-white dark:bg-gray-900 transition-colors ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {content.dashboard.welcome.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {content.dashboard.welcome.subtitle}
          </p>
          <Link className="cursor-pointer" href="/dashboard/createProject">
            <button
              className={`inline-flex cursor-pointer items-center px-6 py-3 border border-transparent text-base font-medium rounded-2xl text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md hover:shadow-lg transition-all duration-300 ${
                isRTL ? "rtl:flex-row-reverse" : ""
              }`}
            >
              <Plus className="w-5 h-5" />
              <span className={isRTL ? "mr-2" : "ml-2"}>
                {content.dashboard.welcome.createButton}
              </span>
            </button>
          </Link>
        </div>

        {/* المشاريع التي أقودها */}
        <section className="mb-12">
          <h2
            className={`text-2xl font-bold text-gray-900 dark:text-white mb-6 ${
              isRTL ? "rtl:text-right" : ""
            }`}
          >
            {content.dashboard.sections.leading}
          </h2>
          {leadingProjects?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadingProjects.map((project) => (
                <Link
                  key={project._id}
                  href={`dashboard/project/${project._id}`}
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
                    members={project.members.length}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState content={content.dashboard} isRTL={isRTL} />
          )}
        </section>

        {/* المشاريع التي أشارك فيها */}
        <section>
          <h2
            className={`text-2xl font-bold text-gray-900 dark:text-white mb-6 ${
              isRTL ? "rtl:text-right" : ""
            }`}
          >
            {content.dashboard.sections.participating}
          </h2>
          {participatingProjects?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {participatingProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={{
                    title: project.title,
                    description: project.description,
                    createdAt: new Date(project.createdAt).toLocaleDateString(),
                    tasks: project.tasks?.length || 0,
                    status: project.public ? "active" : "pending",
                  }}
                  content={content.dashboard}
                  isRTL={isRTL}
                />
              ))}
            </div>
          ) : (
            <EmptyState content={content.dashboard} isRTL={isRTL} />
          )}
        </section>
      </main>
    </div>
  );
}
