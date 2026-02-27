import dbConnect from "../../../../../lib/db";
import Project from "../../../../../models/Project";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id: projectId } = params;

    // Parse the body to get userId, title, and action
    const { userId, title } = await req.json();

    const project = await Project.findById(projectId);
    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    const uid = userId.toString();

    // Ensure customRoles exists as a map
    if (!project.customRoles) {
      project.customRoles = new Map();
    }

    // If title is empty, delete it from map, else set it
    if (!title || title.trim() === "") {
      project.customRoles.delete(uid);
    } else {
      project.customRoles.set(uid, title.trim());
    }

    project.markModified("customRoles");

    await project.save();
    return Response.json(
      { message: "Member title updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update member title error:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
