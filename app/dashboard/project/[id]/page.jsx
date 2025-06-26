"use client";

import { useState, useEffect } from "react";
import { redirect, useParams } from "next/navigation";
import {
  useGetProject,
  useDeleteProject,
} from "../../../../hooks/projects/useGetProjects";
import { useAppContext } from "../../../../contexts/AppContext";
import { translations } from "../../../../lib/translations";
import Loading from "../../../../components/Loading";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../@/components/ui/card";
import { Badge } from "../../../../@/components/ui/badge";
import {
  Calendar,
  Users,
  Edit,
  Trash,
  User,
  Crown,
  CheckCircle,
  Plus,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../../../@/components/ui/alert-dialog";
import { useLeaveProject } from "../../../../hooks/invitations/useLeaveProject";
import { useUpdateProjectStatus } from "../../../../hooks/projects/useUpdateProjectStatus";
import { useGetTasks, useDeleteTask } from "../../../../hooks/tasks/useTasks";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProject(id);
  const { data: tasks, refetch } = useGetTasks();
  const { mutate: deleteTask } = useDeleteTask();

  const { language, userId } = useAppContext();
  const content = translations[language].dashboard.projectDetail;
  const modal = translations[language].dashboard.deleteModal;
  const { mutate: deleteProject } = useDeleteProject();
  const { mutate: leaveProject } = useLeaveProject();
  const { mutate: updateStatus } = useUpdateProjectStatus();

  const [isLeader, setIsLeader] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isRandomUser, setIsRandomUser] = useState(false);

  useEffect(() => {
    if (!data || !userId) return;

    const uid = userId.toString();
    if (
      data.leaderId?._id === uid ||
      data.coLeaders?.some((u) => u._id === uid)
    ) {
      setIsLeader(true);
    } else if (data.members?.some((u) => u._id === uid)) {
      setIsMember(true);
    } else {
      setIsRandomUser(true);
      if (!data.public) redirect("/dashboard/project");
    }
  }, [data, userId]);

  if (isLoading || !data) return <Loading />;
  if (error)
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white text-center p-10 transition-colors">
        Error: {error.message}
      </div>
    );

  const handleEdit = () => redirect(`/dashboard/updateProject/${data._id}`);

  const handleDelete = () => {
    deleteProject({ id: data._id, userId });
    redirect("/dashboard/project");
  };

  const handleLeave = () => {
    leaveProject({ projectId: data._id, userId });
    redirect("/dashboard/project");
  };

  const toggleStatus = () => {
    const newStatus = data.status === "open" ? "finished" : "open";
    updateStatus({ projectId: data._id, userId, status: newStatus });
    redirect("/dashboard/project");
  };

  const isFinished = data.status === "finished";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Project Header Card */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg mb-6">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                  {data.title}
                </CardTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={data.public ? "default" : "secondary"}
                  className={`text-sm ${
                    data.public
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {data.public ? content.public : content.private}
                </Badge>
                <Badge
                  variant="secondary"
                  className={`text-sm ${
                    isFinished
                      ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  }`}
                >
                  {isFinished ? content.statusFinished : content.statusOpen}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Description Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-gray-500" />
                {content.description}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                {data.description || content.noDescription}
              </p>
            </div>

            {/* Project Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Leader Info */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {content.leaderName}:{" "}
                    <strong className="text-gray-800 dark:text-white">
                      {data.leaderId?.name || "Unknown"}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Creation Date */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {content.created}:{" "}
                    <strong className="text-gray-800 dark:text-white">
                      {format(new Date(data.createdAt), "PPP")}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Co-Leaders Section */}
            {data.coLeaders?.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {content.coLeaders}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.coLeaders.map((coLeader) => (
                    <div
                      key={coLeader._id}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded"
                    >
                      <Crown className="w-4 h-4 text-yellow-400" />
                      {coLeader.name !== "null null"
                        ? coLeader.name
                        : coLeader.email.split("@")[0].replace(/[0-9]/g, "")}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Members Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                {content.team}
              </h3>
              {data.members?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.members.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded"
                    >
                      <User className="w-4 h-4 text-blue-400" />
                      {member.name !== "null null"
                        ? member.name
                        : member.email.split("@")[0].replace(/[0-9]/g, "")}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  {content.noMembers}
                </p>
              )}
            </div>

            {/* Tasks Section */}
            {(isLeader || isMember) && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Edit className="w-5 h-5 text-gray-500" />
                    {content.tasks}
                  </h3>
                  {isLeader && !isFinished && (
                    <Link href={`/dashboard/project/${data._id}/addtask`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        {content.addTask}
                      </Button>
                    </Link>
                  )}
                </div>

                {tasks &&
                tasks.some((task) =>
                  isLeader
                    ? task.projectId._id === data._id
                    : task.projectId._id === data._id &&
                      task.assignedTo?.some((user) => user._id === userId)
                ) ? (
                  <div className="space-y-3">
                    {tasks
                      .filter((task) =>
                        isLeader
                          ? task.projectId._id === data._id
                          : task.projectId._id === data._id &&
                            task.assignedTo?.some((user) => user._id === userId)
                      )
                      .map((task) => (
                        <div
                          key={task._id}
                          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {task.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {task.description?.slice(0, 100) ||
                                  "No description."}
                              </p>
                            </div>

                            {!isFinished && (
                              <div className="flex flex-wrap gap-2 justify-end">
                                <Link href={`/dashboard/task/${task._id}`}>
                                  <Button
                                    variant="outline"
                                    className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                  >
                                    <Eye className="w-4 h-4" />
                                    {content.view}
                                  </Button>
                                </Link>
                                {isLeader && (
                                  <>
                                    <Link
                                      href={`/dashboard/task/${task._id}/edit`}
                                    >
                                      <Button
                                        variant="outline"
                                        className="flex items-center gap-2 text-yellow-600 border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                                      >
                                        <Edit className="w-4 h-4" />
                                        {content.edit}
                                      </Button>
                                    </Link>

                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="destructive"
                                          className="flex items-center gap-2"
                                        >
                                          <Trash className="w-4 h-4" />
                                          {content.delete}
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="text-gray-800 dark:text-white">
                                            {modal.confirmTitle}
                                          </AlertDialogTitle>
                                          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                                            {modal.alertTitle}
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            {modal.cancel}
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => {
                                              deleteTask(task._id);
                                              refetch();
                                            }}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            {modal.confirm}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-6 rounded-lg text-center">
                    <p className="text-gray-600 dark:text-gray-300">
                      {content.noTasks}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Leader Actions */}
              {isLeader && !isFinished && (
                <>
                  <Button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    {content.edit}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex items-center gap-2"
                      >
                        <Trash className="w-4 h-4" />
                        {content.delete}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-800 dark:text-white">
                          {modal.confirmTitle}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                          {modal.alertTitle}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{modal.cancel}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {modal.confirm}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              {/* Toggle Status Button */}
              {isLeader && (
                <Button
                  className={`flex items-center gap-2 ${
                    isFinished
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  onClick={toggleStatus}
                >
                  <CheckCircle className="w-4 h-4" />
                  {isFinished ? content.reopenProject : content.finishProject}
                </Button>
              )}

              {/* Leave Project Button */}
              {isMember && !isFinished && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
                    >
                      {content.leave}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-gray-800 dark:text-white">
                        {content.leaveConfirmTitle}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                        {content.leaveConfirmDesc}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{modal.cancel}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLeave}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {content.leaveConfirm}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
