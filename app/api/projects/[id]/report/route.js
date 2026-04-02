import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import Project from "../../../../../models/Project";
import Task from "../../../../../models/Task";
import User from "../../../../../models/User";
import Section from "../../../../../models/Section";

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

    const userId = req.headers.get("userId");
    const isLeader = userId && (
      project.leaderId?._id.toString() === userId ||
      project.coLeaders.some(l => l._id.toString() === userId)
    );

    let allSections = await Section.find({ projectId }).lean();
    
    // Filter sections for members
    if (!isLeader && userId) {
      allSections = allSections.filter(sec => 
        !sec.members || sec.members.length === 0 || sec.members.some(m => m.toString() === userId)
      );
    }
    
    const allowedSectionIds = allSections.map(s => s._id.toString());

    const tasks = await Task.find({ projectId })
      .populate("assignedTo", "name email")
      .populate("sectionId", "title")
      .lean();

    const formatName = (user) => {
      if (!user) return "Unknown";
      if (user.name && user.name !== "null null") return user.name;
      return user.email?.split("@")[0].replace(/[0-9]/g, "") || "Unknown";
    };

    const visibleTaskIds = new Set();
    const visibleTasks = [];

    const sectionReports = allSections.map(section => {
      const sectionTasks = tasks.filter(t => {
        const inLegacy = t.sectionId?._id?.toString() === section._id.toString() || t.sectionId?.toString() === section._id.toString();
        const inAssignments = t.sectionAssignments?.some(sa => sa.sectionId?.toString() === section._id.toString() || sa.sectionId?._id?.toString() === section._id.toString());
        return inAssignments || (!t.sectionAssignments?.length && inLegacy);
      });

      sectionTasks.forEach(t => {
         if (!visibleTaskIds.has(t._id.toString())) {
            visibleTaskIds.add(t._id.toString());
            visibleTasks.push(t);
         }
      });
      
      const completedTasks = sectionTasks.filter((task) => task.status === "completed");
      const remainingTasks = sectionTasks.filter((task) => task.status !== "completed");
      
      let overdueTasksCount = 0;
      const taskDetails = sectionTasks.map((task) => {
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
          assignedTo: task.assignedTo ? task.assignedTo.map(formatName) : [],
        };
      });

      return {
        id: section._id.toString(),
        title: section.title,
        isDefault: section.isDefault,
        totalTasks: sectionTasks.length,
        completedTasks: completedTasks.length,
        remainingTasks: remainingTasks.length,
        overdueTasks: overdueTasksCount,
        tasks: taskDetails
      };
    });

    let totalTasks = visibleTasks.length;
    let completedTasks = visibleTasks.filter(t => t.status === "completed").length;
    let remainingTasks = visibleTasks.filter(t => t.status !== "completed").length;
    let overdueTasks = visibleTasks.filter(task => {
        const due = new Date(task.dueDate);
        const today = new Date();
        return task.dueDate && task.status !== "completed" && due < today && due.toDateString() !== today.toDateString();
    }).length;

    return NextResponse.json({
      projectTitle: project.title,
      leader: formatName(project.leaderId),
      coLeaders: project.coLeaders.map(formatName),
      hasSections: project.hasSections,
      totalTasks,
      completedTasks,
      remainingTasks,
      overdueTasks,
      sections: sectionReports,
      todos: [...(project.todos ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    });
  } catch (error) {
    console.error("GET Project/Tasks Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 },
    );
  }
}
