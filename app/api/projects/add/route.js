import dbConnect from "../../../../lib/db";
import Project from "../../../../models/Project";
import InviteRequest from "../../../../models/InviteRequest";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { title, leaderId, inviteRequests = [], ...rest } = body;

    // التحقق من الحقول المطلوبة
    if (!title || !leaderId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // إنشاء المشروع
    const newProject = await Project.create({
      title,
      leaderId,
      ...rest,
    });

    // إنشاء الدعوات
    if (inviteRequests.length > 0) {
      const invites = inviteRequests.map((invite) => ({
        email: invite.email,
        projectId: newProject._id,
        invitedBy: leaderId,
      }));

      await InviteRequest.insertMany(invites);
    }

    return Response.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/projects/add:", error);
    return Response.json({ error: "Failed to add project" }, { status: 500 });
  }
}
