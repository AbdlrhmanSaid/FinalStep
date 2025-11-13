"use client";

import { useAppContext } from "../../../contexts/AppContext";
import { useGetTasks } from "../../../hooks/tasks/useTasks";
import { translations } from "../../../lib/translations";
import Loading from "../../../components/Loading";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";

const TasksClient = () => {
  const { userId, language } = useAppContext();
  const { data: tasks, isLoading } = useGetTasks();

  const content = translations[language].dashboard.tasks;

  const myTasks = useMemo(() => {
    if (!tasks || !userId) return [];

    return tasks.filter((task) =>
      task.assignedTo?.some((user) => user._id === userId)
    );
  }, [tasks, userId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bgMain h-screen ">
      <div className="max-w-4xl mx-auto h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-clip-text  dark:text-white text-gray-800">
            {content.pageTitle}
          </h1>
          {myTasks.length > 0 && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {myTasks.length}{" "}
              {myTasks.length === 1 ? content.task : content.tasks}
            </span>
          )}
        </div>

        {myTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              {content.emptyTitle}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {content.emptyDescription || content.empty}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {myTasks.map((task) => (
              <div
                key={task._id}
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800/50"
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {task.title}
                        </h2>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : task.status === "in-progress"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {content.statusValues[task.status] ?? task.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                        {task.description}
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/task/${task._id}`}
                      className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-medium transition-all shadow-sm hover:shadow-md"
                    >
                      <span>{content.view}</span>
                      <span>
                        <ArrowRight />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksClient;
