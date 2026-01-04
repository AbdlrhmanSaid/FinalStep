import {
  CheckCircle,
  Users,
  User,
  Flag,
  Clock,
  ChevronRight,
  GanttChartSquare,
} from "lucide-react";

export default function ProjectCard({
  project,
  content,
  isRTL,
  members,
  className = "",
  viewMode = "grid",
}) {
  const status = project.status || (project.public ? "active" : "pending");

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "completed":
        return <Flag className="w-4 h-4" />;
      case "pending":
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const calculateProgress = () => {
    // التحقق من وجود tasks وأنها مصفوفة
    if (!project.tasks || !Array.isArray(project.tasks)) return 0;

    // حساب المهام المكتملة
    const completedTasks = project.tasks.reduce((count, task) => {
      return task.status === "completed" ? count + 1 : count;
    }, 0);

    return project.tasks.length > 0
      ? Math.round((completedTasks / project.tasks.length) * 100)
      : 0;
  };

  const progress = project.progress || calculateProgress();

  if (viewMode === "list") {
    return (
      <div
        className={`w-full p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-300 ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Project Icon */}
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl flex-shrink-0">
            <GanttChartSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {project.title}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
              >
                {getStatusIcon(status)}
                <span className={isRTL ? "mr-1" : "ml-1"}>
                  {content.projectCard.status[status]}
                </span>
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
              {project.description || content.projectCard.noDescription}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>
                  {members} {content.projectCard.members}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>
                  {project.tasks || 0} {content.projectCard.tasks}
                </span>
              </div>
              {project.leader && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    {isRTL ? "قائد:" : "Leader:"} {project.leader}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default grid view
  return (
    <div
      className={`p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
          <GanttChartSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
        >
          {getStatusIcon(status)}
          <span className={isRTL ? "mr-1" : "ml-1"}>
            {content.projectCard.status[status]}
          </span>
        </span>
      </div>

      {/* Project Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {project.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
          {project.description || content.projectCard.noDescription}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {members} {content.projectCard.members}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>
              {project.tasks || 0} {content.projectCard.tasks}
            </span>
          </div>
          {project.leader && (
            <div className="flex items-center gap-2 col-span-2">
              <User className="w-4 h-4" />
              <span>
                {isRTL ? "قائد المشروع:" : "Project Leader:"} {project.leader}
              </span>
            </div>
          )}
          {project.deadline && (
            <div className="flex items-center gap-2 col-span-2">
              <Flag className="w-4 h-4" />
              <span>
                {isRTL ? "الموعد النهائي:" : "Deadline:"}{" "}
                {new Date(project.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

