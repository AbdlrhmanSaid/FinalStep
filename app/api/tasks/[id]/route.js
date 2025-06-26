import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import Task from "../../../../models/Task";
import Project from "../../../../models/Project";

const validTransitions = {
  open: ["submitted"],
  submitted: ["completed", "rejected"],
  rejected: ["submitted"],
  completed: [],
};

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

    const task = await Task.findById(params.id);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (body.status && !validTransitions[task.status]?.includes(body.status)) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${task.status} to ${body.status}`,
        },
        { status: 400 }
      );
    }

    if (body.status === "submitted") {
      if (!body.submission?.description) {
        return NextResponse.json(
          { error: "Submission requires description " },
          { status: 400 }
        );
      }

      // التحقق من صحة الروابط
      const invalidLinks = body.submission.links.filter((link) => {
        try {
          new URL(link);
          return false;
        } catch {
          return true;
        }
      });

      if (invalidLinks.length > 0) {
        return NextResponse.json(
          { error: `Invalid URLs: ${invalidLinks.join(", ")}` },
          { status: 400 }
        );
      }
    }

    if (
      body.status === "rejected" &&
      (!body.review?.note || body.review.note.trim() === "")
    ) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    if (body.status === "submitted" && body.submission) {
      task.status = "submitted";
      task.submission = {
        description: body.submission.description || "",
        links: body.submission.links || [],
        submittedAt: new Date(),
      };
    } else if (body.status === "completed" || body.status === "rejected") {
      task.status = body.status;
      task.review = {
        reviewedBy: body.review?.reviewedBy || task.review?.reviewedBy,
        reviewedAt: new Date(),
        note: body.review?.note || "",
      };
    } else {
      Object.assign(task, body);
    }

    const updated = await task.save();

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

    const task = await Task.findById(params.id);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await Task.findByIdAndDelete(params.id);

    if (task.projectId) {
      await Project.findByIdAndUpdate(task.projectId, {
        $pull: { tasks: task._id },
      });
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
