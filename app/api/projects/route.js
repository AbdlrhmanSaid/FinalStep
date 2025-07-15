import dbConnect from "../../../lib/db";
import Project from "../../../models/Project";
import User from "../../../models/User";

export async function GET(req) {
  try {
    await dbConnect();

    const userId = req.headers.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // رجع المشاريع اللي فيها المستخدم كـ Leader أو Co-Leader أو Member
    const projects = await Project.find({
      $or: [{ leaderId: userId }, { coLeaders: userId }, { members: userId }],
    })
      .populate("leaderId")
      .populate("coLeaders")
      .populate("members");

    // فلترة الدعوات الغير منطقية (دعوات لأشخاص فعليًا أعضاء)
    for (const project of projects) {
      const memberEmails = [
        project.leaderId?.email,
        ...project.coLeaders.map((u) => u.email),
        ...project.members.map((u) => u.email),
      ];

      const originalInvites = [...project.inviteRequests];
      project.inviteRequests = originalInvites.filter(
        (invite) => !memberEmails.includes(invite.email)
      );

      if (originalInvites.length !== project.inviteRequests.length) {
        await project.save();
      }
    }

    return Response.json(projects, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
