import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import Project from "../../../../../models/Project";
import Task from "../../../../../models/Task";
import User from "../../../../../models/User";

export async function GET(req, { params }) {
  try {
    const { id: projectId } = await params;

    await dbConnect();

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

    let overdueTasksCount = 0;

    const taskDetails = tasks.map((task) => {
      const due = new Date(task.dueDate);
      const today = new Date();
      const isOverdue =
        task.dueDate &&
        task.status !== "completed" &&
        due < today &&
        due.toDateString() !== today.toDateString();

      if (isOverdue) overdueTasksCount++;

      return {
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        isOverdue,
        submissionMethod: task.submissionMethod,
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
      overdueTasks: overdueTasksCount,
      tasks: taskDetails,
    });
  } catch (error) {
    console.error("GET Project/Tasks Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 },
    );
  }
}
