import dbConnect from "../../../../lib/db";
import InviteRequest from "../../../../models/InviteRequest";
import Project from "../../../../models/Project";
import User from "../../../../models/User";

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { userId } = await request.json();

    const invite = await InviteRequest.findById(id);

    if (!invite || invite.status !== "pending")
      return Response.json({ error: "Invalid invite" }, { status: 400 });

    invite.status = "accepted";
    await invite.save();

    await Project.findByIdAndUpdate(invite.projectId, {
      $addToSet: { members: userId },
    });

    return Response.json({ message: "Invite accepted" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to accept invite" }, { status: 500 });
  }
}
