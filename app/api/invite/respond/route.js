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

    const project = await Project.findById(invite.projectId);
    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    const invitedUser = await User.findOne({ email: invite.email });
    if (!invitedUser) {
      return Response.json(
        { error: "Invited user not found" },
        { status: 404 }
      );
    }

    if (action === "accepted") {
      const isAlreadyMember =
        project.members.some(
          (memberId) => memberId.toString() === invitedUser._id.toString()
        ) ||
        project.coLeaders.some(
          (co) => co.toString() === invitedUser._id.toString()
        ) ||
        project.leaderId.toString() === invitedUser._id.toString();

      if (!isAlreadyMember) {
        project.members.push(invitedUser._id);
      }
    }

    // ✅ إزالة الدعوة من project.inviteRequests إذا كانت موجودة
    project.inviteRequests = project.inviteRequests.filter(
      (req) => req.email !== invite.email
    );

    await project.save();

    return Response.json(
      { message: "Invite response processed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Invite Response Error:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
