"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useGetProject } from "../../../../hooks/projects/useGetProjects";
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
import Loading from "../../../../components/Loading";
import { useGetUsers } from "../../../../hooks/users/useGetUsers";
import { translations } from "../../../../lib/translations";
import { useAppContext } from "../../../../contexts/AppContext";
import Link from "next/link";

const page = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProject(id);
  const { language } = useAppContext();
  const content = translations[language].dashboard.projectDetail;

  const { data: users } = useGetUsers();

  const user = users?.filter(
    (user) => user._id.toString() === data?.leaderId.toString()
  );

  if (isLoading || !user) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-gray-900 dark:text-white">
        Error: {error.message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-gray-900 dark:text-white">
        No project found
      </div>
    );
  }

  const handleEdit = () => {
    console.log("Edit project:", data._id);
  };

  const handleDelete = () => {
    console.log("Delete project:", data._id);
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
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {content.description}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {data.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {content.leaderName} : {user[0].name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {content.created}: {format(new Date(data.createdAt), "PPP")}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {content.team}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {data.members.length > 0
                    ? `${data.members.length} members`
                    : "No members yet"}
                </p>
                {data.coLeaders.length > 0 && (
                  <p className="text-gray-600 dark:text-gray-300">
                    {content.coLeaders}: {data.coLeaders.join(", ")}
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {content.tasks}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {data.tasks.length > 0
                    ? `${data.tasks.length} tasks`
                    : "No tasks assigned"}
                </p>
                <Link href={"#"}>
                  <Button>{content.addTask}</Button>
                </Link>
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <Edit className="h-4 w-4" />
                  <span>{content.edit}</span>
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="flex items-center space-x-2"
                >
                  <Trash className="h-4 w-4" />
                  <span>{content.delete}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
