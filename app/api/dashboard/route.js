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

  // جلب آخر 3 دعوات pending
  const pendingInvites = await InviteRequest.find({
    email: user.email,
    status: "pending",
  })
    .populate("projectId", "title")
    .sort({ createdAt: -1 })
    .limit(3);

  // جلب آخر 3 مهام
  const recentTasks = await Task.find({
    assignedTo: { $in: [user._id] },
  })
    .sort({ createdAt: -1 })
    .limit(3);

  return NextResponse.json({
    projectsCount: allProjects.length,
    finishedProjectsCount: finishedProjects.length,
    tasksCount: allTasks.length,
    finishedTasksCount: finishedTasks.length,
    pendingInvitesCount: pendingInvites.length,
    recentInvites: pendingInvites,
    recentTasks: recentTasks,
  });
}

