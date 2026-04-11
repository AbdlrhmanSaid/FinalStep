import { NextResponse } from "next/server";
import { createTask, getAllTasks } from "@/lib/server/tasks";
import { sendTaskAssignmentEmail } from "@/lib/emailService";
import Project from "@/models/Project";
import User from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const task = await createTask(body);

    // Send Emails asynchronously
    (async () => {
      try {
        const project = await Project.findById(task.projectId).select("title");
        const assignedUsers = await User.find({ _id: { $in: task.assignedTo } }).select("email");
        const emailsToNotify = assignedUsers.map(u => u.email).filter(Boolean);
        
        if (emailsToNotify.length > 0 && project) {
          await sendTaskAssignmentEmail({
            emails: emailsToNotify,
            taskTitle: task.title,
            projectName: project.title,
            taskId: task._id.toString()
          });
        }
      } catch (err) {
        console.error("Error sending Task Emails:", err);
      }
    })();

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST Task Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tasks = await getAllTasks();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("GET Tasks Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
