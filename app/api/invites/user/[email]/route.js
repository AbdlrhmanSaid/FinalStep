// app/api/invite/user/[email]/route.js
import dbConnect from "../../../../../lib/db";
import InviteRequest from "../../../../../models/InviteRequest";
import Project from "../../../../../models/Project";

export async function GET(_, { params }) {
  try {
    await dbConnect();
    const { email } = params;

    const invites = await InviteRequest.find({
      email,
      status: "pending",
    }).populate("projectId");

    return Response.json(invites, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to fetch invites" }, { status: 500 });
  }
}
