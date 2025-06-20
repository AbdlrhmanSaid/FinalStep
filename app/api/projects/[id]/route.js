import dbConnect from "../../../../lib/db";
import Project from "../../../../models/Project";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const userId = request.headers.get("userId");
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isAuthorized =
      project.leaderId.toString() === userId?.toString() ||
      project.coLeaders.map((id) => id.toString()).includes(userId?.toString());

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
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const userId = request.headers.get("userId");
    const body = await request.json();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isAuthorized =
      project.leaderId.toString() === userId?.toString() ||
      project.coLeaders.map((id) => id.toString()).includes(userId?.toString());

    if (!isAuthorized) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: Only the leader or co-leaders can update this project.",
        },
        { status: 403 }
      );
    }

    if ("leaderId" in body) {
      delete body.leaderId;
    }

    const updatedProject = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
