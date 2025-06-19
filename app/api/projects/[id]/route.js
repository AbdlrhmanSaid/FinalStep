import dbConnect from "../../../../lib/db";
import Project from "../../../../models/Project";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

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
    const { id } = await params;

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
