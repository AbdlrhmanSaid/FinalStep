import dbConnect from "../../../../lib/db";
import Project from "../../../../models/Project";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    if (!body.title || !body.leaderId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const newProject = await Project.create(body);
    return Response.json(newProject, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to add project" }, { status: 500 });
  }
}
