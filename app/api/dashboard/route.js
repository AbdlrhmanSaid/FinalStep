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
    (project) => project.status === "finished",
  );

  const allTasks = await Task.find({
    assignedTo: { $in: [user._id] },
  });

  const finishedTasks = allTasks.filter((task) => {
    if (task.status === "completed") return true;
    if (task.memberSubmissions && task.memberSubmissions.length > 0) {
      const mySub = task.memberSubmissions.find(
        (s) => (s.userId?._id || s.userId)?.toString() === user._id.toString(),
      );
      return mySub && mySub.status === "completed";
    }
    return false;
  });

  const pendingInvites = await InviteRequest.find({
    email: user.email,
    status: "pending",
  })
    .populate("projectId", "title")
    .sort({ createdAt: -1 })
    .limit(3);

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
