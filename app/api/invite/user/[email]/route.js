// ✅ api/invite/user/[email]/route.js
import dbConnect from "../../../../../lib/db";
import InviteRequest from "../../../../../models/InviteRequest";

export async function GET(_, { params }) {
  try {
    await dbConnect();

    const { email } = await params;

    const invites = await InviteRequest.find({
      email,
      status: "pending",
    })
      .populate("projectId")
      .populate("invitedBy");

    return Response.json(invites, { status: 200 });
  } catch (error) {
    console.error("GET /api/invite/user/[email] Error:", error);
    return Response.json({ error: "Failed to fetch invites" }, { status: 500 });
  }
}
