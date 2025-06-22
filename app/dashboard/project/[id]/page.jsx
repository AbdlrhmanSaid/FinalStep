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
import { Calendar, Users, Edit, Trash, User, Crown } from "lucide-react";
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

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProject(id);
  const { language, userId } = useAppContext();
  const content = translations[language].dashboard.projectDetail;
  const modal = translations[language].dashboard.deleteModal;
  const { mutate: deleteProject } = useDeleteProject();

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
      if (!data.public) {
        redirect("/dashboard/project");
      }
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white flex flex-col items-center p-6 transition-colors">
      <div className="w-full max-w-3xl">
        <Card className="bg-gray-50 dark:bg-gray-800 shadow-md border-gray-200 dark:border-gray-700 rounded-lg">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-500" />
                {data.title}
              </CardTitle>
              <Badge
                variant={data.public ? "default" : "secondary"}
                className={data.public ? "bg-green-500" : "bg-gray-500"}
              >
                {data.public ? content.public : content.private}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Edit className="w-5 h-5 text-gray-500" />
                {content.description}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                {data.description || content.noDescription}
              </p>
            </div>

            {/* Leader and Creation Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  {content.leaderName}:{" "}
                  <strong>{data.leaderId?.name || "Unknown"}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  {content.created}:{" "}
                  <strong>{format(new Date(data.createdAt), "PPP")}</strong>
                </span>
              </div>
            </div>

            {/* Team */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                {content.team}
              </h3>
              <div className="space-y-2">
                {data.members?.length > 0 ? (
                  <ul className="list-none space-y-2">
                    {data.members.map((member) => (
                      <li
                        key={member._id}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                      >
                        <User className="w-4 h-4 text-blue-400" />
                        {member.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    {content.noMembers}
                  </p>
                )}
                {data.coLeaders?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-gray-600 dark:text-gray-300 font-semibold">
                      {content.coLeaders}:
                    </p>
                    <ul className="list-none space-y-2">
                      {data.coLeaders.map((coLeader) => (
                        <li
                          key={coLeader._id}
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                        >
                          <Crown className="w-4 h-4 text-yellow-400" />
                          {coLeader.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Tasks */}
            {(isLeader || isMember) && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-gray-500" />
                  {content.tasks}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {data.tasks?.length > 0
                    ? `${data.tasks.length} tasks`
                    : content.noTasks}
                </p>
                {isLeader && (
                  <Link href={`/dashboard/project/${data._id}/addtask`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      {content.addTask}
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* Leader Actions */}
            {isLeader && (
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <Edit className="w-4 h-4" />
                  {content.edit}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                    >
                      <Trash className="w-4 h-4" />
                      {content.delete}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-gray-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="dark:text-white">
                        {modal.confirmTitle}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="dark:text-gray-300">
                        {modal.alertTitle}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                        {modal.cancel}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleDelete}
                      >
                        {modal.confirm}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
