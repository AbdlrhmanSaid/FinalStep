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
import { Calendar, Users, Edit, Trash } from "lucide-react";
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

const Page = () => {
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
        redirect("/dashboard");
      }
    }
  }, [data, userId]);

  if (isLoading || !data) return <Loading />;
  if (error)
    return <div className="text-center p-10">Error: {error.message}</div>;

  const handleEdit = () => redirect(`/dashboard/updateProject/${data._id}`);
  const handleDelete = () => {
    deleteProject({ id: data._id, userId });
    redirect("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-none">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.title}
              </CardTitle>
              <Badge variant={data.public ? "default" : "secondary"}>
                {data.public ? content.public : content.private}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* الوصف */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {content.description}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {data.description || content.noDescription}
              </p>
            </div>

            {/* القائد وتاريخ الإنشاء */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  {content.leaderName}: {data.leaderId?.name || "Unknown"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  {content.created}: {format(new Date(data.createdAt), "PPP")}
                </span>
              </div>
            </div>

            {/* الفريق */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {content.team}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {data.members?.length > 0
                  ? `${data.members.length} members`
                  : content.noMembers}
              </p>
              {data.coLeaders?.length > 0 && (
                <p className="text-gray-600 dark:text-gray-300">
                  {content.coLeaders}:
                  {data.coLeaders.map((u) => ` ${u.name}`).join(",")}
                </p>
              )}
            </div>

            {/* المهام */}
            {(isLeader || isMember) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {content.tasks}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {data.tasks?.length > 0
                    ? `${data.tasks.length} tasks`
                    : content.noTasks}
                </p>

                {isLeader && (
                  <Link href={`/dashboard/project/${data._id}/addtask`}>
                    <Button>{content.addTask}</Button>
                  </Link>
                )}
              </div>
            )}

            {isLeader && (
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <Edit className="h-4 w-4" />
                  <span>{content.edit}</span>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex items-center space-x-2"
                    >
                      <Trash className="h-4 w-4" />
                      <span>{content.delete}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{modal.confirmTilte}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {modal.alertTitle}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className={" hover:bg-black"}>
                        {modal.cancel}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className={"bg-red-700"}
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

export default Page;
