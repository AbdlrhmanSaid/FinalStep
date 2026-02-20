import dbConnect from "../../../../lib/db";
import Project from "../../../../models/Project";
import InviteRequest from "../../../../models/InviteRequest";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { title, leaderId, inviteRequests = [], ...rest } = body;

    if (!title || !leaderId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProject = await Project.create({
      title,
      leaderId,
      ...rest,
      inviteRequests: inviteRequests.map((i) => ({ email: i.email })),
    });

    if (inviteRequests.length > 0) {
      const invites = [];

      for (const { email } of inviteRequests) {
        const existing = await InviteRequest.findOne({
          email,
          projectId: newProject._id,
          status: "pending",
        });

        if (!existing) {
          invites.push({
            email,
            projectId: newProject._id,
            invitedBy: leaderId,
            status: "pending",
          });
        }
      }

      if (invites.length > 0) {
        await InviteRequest.insertMany(invites);
      }
    }

    return Response.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/projects/add:", error);
    return Response.json({ error: "Failed to add project" }, { status: 500 });
  }
}

