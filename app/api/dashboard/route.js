import { NextResponse } from "next/server";
import { getFullUserOrRedirect } from "../../../lib/getFullUser";
import dbConnect from "../../../lib/db";
import Project from "../../../models/Project";
import Task from "../../../models/Task";
import InviteRequest from "../../../models/InviteRequest";

export async function GET() {
  await dbConnect();
  const user = await getFullUserOrRedirect();

  const allProjects = await Project.find({
    $or: [
      { leaderId: user._id },
      { coLeaders: user._id },
      { members: user._id },
    ],
  });

  const finishedProjects = allProjects.filter(
    (project) => project.status === "finished"
  );

  const allTasks = await Task.find({
    assignedTo: { $in: [user._id] },
  });

  const finishedTasks = allTasks.filter((task) => task.status === "completed");

  const pendingInvites = await InviteRequest.find({
    email: user.email,
    status: "pending",
  });

  return NextResponse.json({
    projectsCount: allProjects.length,
    finishedProjectsCount: finishedProjects.length,
    tasksCount: allTasks.length,
    finishedTasksCount: finishedTasks.length,
    pendingInvitesCount: pendingInvites.length,
  });
}
