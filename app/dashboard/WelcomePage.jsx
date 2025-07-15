"use client";
import { useAppContext } from "../../contexts/AppContext";
import {
  Home,
  User,
  Briefcase,
  CheckCircle,
  Clock,
  Mail,
  ListChecks,
} from "lucide-react";
import { translations } from "../../lib/translations";
import Link from "next/link";
import { useDashboard } from "../../hooks/useDashboard";
import Loading from "../../components/Loading";
import { Button } from "../../@/components/ui/button";

export default function WelcomePage() {
  const { email, language } = useAppContext();
  const content = translations[language].dashboard;
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <div className="min-h-screen bgMain flex items-center justify-center">
        <div className="text-red-500">Error loading dashboard data</div>
      </div>
    );

  const stats = [
    {
      title: content.stats.projects,
      value: data?.projectsCount || 0,
      icon: <Briefcase className="w-6 h-6" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: content.stats.finishedProjects,
      value: data?.finishedProjectsCount || 0,
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: content.stats.tasks,
      value: data?.tasksCount || 0,
      icon: <ListChecks className="w-6 h-6" />,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: content.stats.finishedTasks,
      value: data?.finishedTasksCount || 0,
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: "bg-teal-100",
      textColor: "text-teal-600",
    },
    {
      title: content.stats.pendingInvites,
      value: data?.pendingInvitesCount || 0,
      icon: <Mail className="w-6 h-6" />,
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bgMain bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Home className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {content.welcome.title}
              </h1>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <User className="w-4 h-4" />
                <strong className="text-blue-500">{email || "Guest"}</strong>
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/how-it-works"
            className="text-gray-500 dark:text-gray-400 max-w-md text-sm md:text-right"
          >
            <Button
              variant="outline"
              className="text-gray-500 dark:text-gray-400 max-w-md text-sm md:text-right"
            >
              {content.welcome.subtitle}
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-sm border dark:border-gray-700 ${stat.bgColor} dark:bg-gray-800 transition-all hover:shadow-md`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-full ${stat.bgColor} dark:bg-gray-700`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Summary */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {content.projects.title}
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {content.projects.total}
                  </span>
                </div>
                <span className="font-bold">{data?.projectsCount || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {content.projects.completed}
                  </span>
                </div>
                <span className="font-bold">
                  {data?.finishedProjectsCount || 0}
                </span>
              </div>

              {data?.pendingInvitesCount > 0 && (
                <Link
                  href="/dashboard/invitations"
                  className="block mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {content.invitations.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-bold">
                        {data.pendingInvitesCount}
                      </span>
                      <span className="text-blue-500">→</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Tasks Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {content.tasks.title}
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <ListChecks className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {content.tasks.total}
                  </span>
                </div>
                <span className="font-bold">{data?.tasksCount || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {content.tasks.completed}
                  </span>
                </div>
                <span className="font-bold">
                  {data?.finishedTasksCount || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {content.tasks.pending}
                  </span>
                </div>
                <span className="font-bold">
                  {Math.max(
                    (data?.tasksCount || 0) - (data?.finishedTasksCount || 0),
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {content.quickActions.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/projects"
              className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
            >
              <Briefcase className="w-5 h-5 text-blue-500" />
              <span>{content.quickActions.viewProjects}</span>
            </Link>
            <Link
              href="/dashboard/tasks"
              className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
            >
              <ListChecks className="w-5 h-5 text-purple-500" />
              <span>{content.quickActions.viewTasks}</span>
            </Link>
            <Link
              href="/dashboard/invitations"
              className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
            >
              <Mail className="w-5 h-5 text-amber-500" />
              <span>{content.quickActions.viewInvites}</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
            >
              <User className="w-5 h-5 text-gray-500" />
              <span>{content.quickActions.profileSettings}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
