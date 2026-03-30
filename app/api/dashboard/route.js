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
    .populate("projectId", "title description")
    .sort({ createdAt: -1 })
    .limit(3);

  const recentTasks = await Task.find({
    assignedTo: { $in: [user._id] },
  })
    .populate("projectId", "title")
    .sort({ createdAt: -1 })
    .limit(5);

  const upcomingTasks = await Task.find({
    assignedTo: { $in: [user._id] },
    dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    status: { $nin: ["completed", "finished", "rejected", "ended"] }
  })
  .populate("projectId", "title")
  .sort({ dueDate: 1 })
  .limit(3);

  const activeProjects = allProjects
    .filter(p => p.status !== "finished")
    .slice(0, 3);
  
  // Tasks Breakdown by status
  const taskStatusBreakdown = {
    pending: allTasks.filter(t => t.status === "pending").length,
    inProgress: allTasks.filter(t => t.status === "in-progress" || t.status === "inProgress").length,
    submitted: allTasks.filter(t => t.status === "submitted").length,
    completed: finishedTasks.length,
    rejected: allTasks.filter(t => t.status === "rejected").length,
  };

  return NextResponse.json({
    projectsCount: allProjects.length,
    finishedProjectsCount: finishedProjects.length,
    tasksCount: allTasks.length,
    finishedTasksCount: finishedTasks.length,
    pendingInvitesCount: pendingInvites.length,
    recentInvites: pendingInvites,
    recentTasks: recentTasks,
    upcomingTasks,
    activeProjects,
    taskStatusBreakdown,
  });
}
