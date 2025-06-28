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
    "name email"
  );

  const completedTasks = tasks.filter((task) => task.status === "completed");
  const remainingTasks = tasks.filter((task) => task.status !== "completed");

  const taskDetails = tasks.map((task) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
    return {
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      isOverdue,
      assignedTo: task.assignedTo.map((user) => user.name),
    };
  });

  return NextResponse.json({
    projectTitle: project.title,
    leader: project.leaderId.name,
    coLeaders: project.coLeaders.map((user) => user.name),
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    remainingTasks: remainingTasks.length,
    tasks: taskDetails,
  });
}
