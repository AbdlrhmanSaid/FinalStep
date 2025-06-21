import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import Task from "../../../models/Task";
import { useAppContext } from "../../../contexts/AppContext";
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { title, description, projectId, assignedTo } = body;
    const { userId } = useAppContext();

    if (!title || !projectId || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTask = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      status: "pending",
      createdBy: userId,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find()
      .populate("assignedTo")
      .populate("projectId")
      .populate("createdBy");
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
