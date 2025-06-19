import { Calendar, CheckCircle, ShieldCheck, Users, User } from "lucide-react";

export default function ProjectCard({ project, content, isRTL, members }) {
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
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
      default:
        return <ShieldCheck className="w-4 h-4" />;
    }
  };

  return (
    <>
      <div
        className={`cursor-pointer bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              status
            )} ${isRTL ? "rtl:mr-2" : ""}`}
          >
            {getStatusIcon(status)}
            <span className={`${isRTL ? "mr-1" : "ml-1"}`}>
              {content.projectCard.status[status]}
            </span>
          </span>
        </div>

        {/* Info */}
        <div className="space-y-3">
          <h3
            className={`text-lg font-semibold text-gray-900 dark:text-white ${
              isRTL ? "rtl:text-right" : ""
            }`}
          >
            {project.title}
          </h3>
          <div className="info flex justify-between">
            <p
              className={`text-gray-600 dark:text-gray-300 text-sm leading-relaxed ${
                isRTL ? "rtl:text-right" : ""
              }`}
            >
              {project.description}
            </p>
            <p
              className={`text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex items-center ${
                isRTL ? "rtl:text-right" : ""
              }`}
            >
              <span>{members}</span>
              <span>
                <User />
              </span>
            </p>
          </div>

          {/* Footer */}
          <div
            className={`flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 ${
              isRTL ? "rtl:flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex items-center text-sm text-gray-500 dark:text-gray-400 ${
                isRTL ? "rtl:flex-row-reverse" : ""
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                {content.projectCard.createdAt}: {project.createdAt}
              </span>
            </div>
            <div
              className={`flex items-center text-sm text-gray-500 dark:text-gray-400 ${
                isRTL ? "rtl:flex-row-reverse" : ""
              }`}
            >
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {project.tasks || 0}
              </span>
              <span className={`ml-1`}>{content.projectCard.tasks}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
