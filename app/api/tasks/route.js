import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import Task from "../../../models/Task";
import Project from "../../../models/Project";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const task = await Task.create(body);

    // ✅ أضف الـ task إلى المشروع
    if (task.projectId) {
      await Project.findByIdAndUpdate(task.projectId, {
        $push: { tasks: task._id },
      });
    }

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST Task Error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find()
      .populate("projectId")
      .populate("assignedTo")
      .populate("createdBy")
      .populate("review.reviewedBy");

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("GET Tasks Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
