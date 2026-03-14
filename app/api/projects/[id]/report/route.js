import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import Project from "../../../../../models/Project";
import Task from "../../../../../models/Task";
import User from "../../../../../models/User";

export async function GET(req, { params }) {
  await dbConnect();

  const projectId = params.id;

  const project = await Project.findById(projectId)
    .populate("leaderId", "name email")
    .populate("coLeaders", "name email");

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const tasks = await Task.find({ projectId }).populate(
    "assignedTo",
    "name email",
  );

  const completedTasks = tasks.filter((task) => task.status === "completed");
  const remainingTasks = tasks.filter((task) => task.status !== "completed");

  const formatName = (user) => {
    if (!user) return "Unknown";
    if (user.name && user.name !== "null null") return user.name;
    return user.email?.split("@")[0].replace(/[0-9]/g, "") || "Unknown";
  };

  const taskDetails = tasks.map((task) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
    return {
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      isOverdue,
      assignedTo: task.assignedTo.map(formatName),
    };
  });

  return NextResponse.json({
    projectTitle: project.title,
    leader: formatName(project.leaderId),
    coLeaders: project.coLeaders.map(formatName),
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    remainingTasks: remainingTasks.length,
    tasks: taskDetails,
  });
}
