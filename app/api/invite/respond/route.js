// app/api/invite/respond/route.js
import dbConnect from "../../../../lib/db";
import InviteRequest from "../../../../models/InviteRequest";
import Project from "../../../../models/Project";
import User from "../../../../models/User";

export async function PUT(req) {
  try {
    await dbConnect();
    const { inviteId, action } = await req.json();

    const invite = await InviteRequest.findById(inviteId);
    if (!invite) {
      return Response.json({ error: "Invite not found" }, { status: 404 });
    }

    invite.status = action;
    await invite.save();

    if (action === "accepted") {
      const user = await User.findOne({ email: invite.email });
      await Project.findByIdAndUpdate(invite.projectId, {
        $addToSet: { members: user._id },
      });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Respond Invite Error:", error);
    return Response.json(
      { error: "Failed to respond to invite" },
      { status: 500 }
    );
  }
}
