import dbConnect from "../../../lib/db";
import Project from "../../../models/Project";

export async function GET() {
  try {
    await dbConnect();

    const projects = await Project.find();

    return Response.json(projects);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
