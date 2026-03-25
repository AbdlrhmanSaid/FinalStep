// File: /api/projects/[id]/update-member-role/route.js

import dbConnect from "../../../../../lib/db";
import Project from "../../../../../models/Project";
import Task from "../../../../../models/Task";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id: projectId } = await params;
    const { userId, action } = await req.json();

    const project = await Project.findById(projectId);
    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    const uid = userId.toString();

    if (action === "remove-member") {
      project.members = project.members.filter((id) => id.toString() !== uid);
      project.coLeaders = project.coLeaders.filter(
        (id) => id.toString() !== uid,
      );
      await Task.updateMany({ projectId }, { $pull: { assignedTo: userId } });
    }

    if (action === "promote") {
      if (
        project.members.some((id) => id.toString() === uid) &&
        !project.coLeaders.some((id) => id.toString() === uid)
      ) {
        project.coLeaders.push(uid);
      }
    }

    if (action === "demote") {
      project.coLeaders = project.coLeaders.filter(
        (id) => id.toString() !== uid,
      );
    }

    await project.save();
    return Response.json({ message: "Member role updated" }, { status: 200 });
  } catch (error) {
    console.error("Update member role error:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
