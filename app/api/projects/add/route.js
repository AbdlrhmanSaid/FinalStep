import dbConnect from "../../../../lib/db";
import Project from "../../../../models/Project";
import InviteRequest from "../../../../models/InviteRequest";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    console.log("BODY =>", body);
    const { title, leaderId, inviteRequests = [], ...rest } = body;

    if (!title || !leaderId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // إنشاء المشروع وإضافة الدعوات داخل حقل inviteRequests
    const newProject = await Project.create({
      title,
      leaderId,
      ...rest,
      inviteRequests: inviteRequests.map((i) => ({ email: i.email })),
    });

    // إنشاء الدعوات في جدول InviteRequest
    if (inviteRequests.length > 0) {
      const invites = inviteRequests.map(({ email }) => ({
        email,
        projectId: newProject._id,
        invitedBy: leaderId,
        status: "pending",
      }));

      await InviteRequest.insertMany(invites);
    }

    return Response.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/projects/add:", error);
    return Response.json({ error: "Failed to add project" }, { status: 500 });
  }
}
