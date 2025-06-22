import dbConnect from "../../../../lib/db";
import Project from "../../../../models/Project";

// 👇 لازم نسجل الموديلات المستخدمة في populate
import "../../../../models/User";
import "../../../../models/Task";

import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET /api/projects/[id]
export async function GET(request, context) {
  try {
    await dbConnect();
    const { id } = context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await Project.findById(id)
      .populate("leaderId")
      .populate("coLeaders")
      .populate("members")
      .populate({
        path: "tasks",
        populate: [
          { path: "assignedTo", strictPopulate: false },
          { path: "createdBy", strictPopulate: false },
        ],
      });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("GET /api/projects/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]
export async function DELETE(request, context) {
  try {
    await dbConnect();
    const { id } = context.params;
    const userId = request.headers.get("userId");

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isAuthorized =
      project.leaderId.toString() === userId ||
      project.coLeaders.map((id) => id.toString()).includes(userId);

    if (!isAuthorized) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: Only the leader or co-leaders can delete this project.",
        },
        { status: 403 }
      );
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/projects/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id]
export async function PUT(request, context) {
  try {
    await dbConnect();
    const { id } = context.params;
    const userId = request.headers.get("userId");
    const body = await request.json();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isAuthorized =
      project.leaderId.toString() === userId ||
      project.coLeaders.map((id) => id.toString()).includes(userId);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // حماية من تعديل الـ leaderId
    if ("leaderId" in body) delete body.leaderId;

    const updated = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Update Project Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
