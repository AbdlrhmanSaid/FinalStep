import dbConnect from "../../../../lib/db";
import Project from "../../../../models/Project";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newProject = await Project.create(body);
    return Response.json(newProject, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to add project" }, { status: 500 });
  }
}
