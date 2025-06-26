import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import Task from "../../../../models/Task";
import User from "../../../../models/User";
import Project from "../../../../models/Project";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const task = await Task.findById(params.id)
      .populate("projectId")
      .populate("assignedTo")
      .populate("createdBy")
      .populate("review.reviewedBy");

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("GET Task Error:", error);
    return NextResponse.json({ error: "Failed to get task" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();

    const updated = await Task.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Task Error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const deleted = await Task.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error("DELETE Task Error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
