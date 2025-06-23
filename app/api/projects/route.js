import dbConnect from "../../../lib/db";
import Project from "../../../models/Project";
import User from "../../../models/User";

export async function GET() {
  try {
    await dbConnect();

    const projects = await Project.find()
      .populate("leaderId")
      .populate("coLeaders")
      .populate("members");

    // فلترة الدعوات الغير منطقية (المكررة)
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
