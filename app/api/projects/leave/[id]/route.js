import dbConnect from "../../../../../lib/db";
import Project from "../../../../../models/Project";
import Task from "../../../../../models/Task";
import Section from "../../../../../models/Section";

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id: projectId } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!projectId || !userId) {
      return Response.json({ error: "Missing data" }, { status: 400 });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    // Remove from project members & co-leaders
    project.members = project.members.filter(
      (memberId) => memberId.toString() !== userId,
    );
    project.coLeaders = project.coLeaders.filter(
      (memberId) => memberId.toString() !== userId,
    );

    // Remove from all tasks assigned to them
    await Task.updateMany({ projectId }, { $pull: { assignedTo: userId } });

    // Remove from all sections in this project
    await Section.updateMany(
      { projectId },
      { $pull: { members: userId } }
    );

    await project.save();

    return Response.json(
      { message: "Left project successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Leave Project Error:", error);
    return Response.json({ error: "Failed to leave project" }, { status: 500 });
  }
}

