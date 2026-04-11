import dbConnect from "../../../../../../lib/db";
import Project from "../../../../../../models/Project";
import User from "../../../../../../models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { sendJoinDecisionEmail } from "@/lib/emailService";

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id, joinId } = await params;
    const body = await request.json();
    const { action } = body;
    const currentUserId = request.headers.get("userId");

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(joinId)
    ) {
      return NextResponse.json(
        { error: "Invalid project ID or join request ID" },
        { status: 400 },
      );
    }

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use 'accept' or 'reject'" },
        { status: 400 },
      );
    }

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Checking if currentUser is Leader or Co-leader
    const isLeaderOrCoLeader =
      project.leaderId.toString() === currentUserId ||
      project.coLeaders.map((cl) => cl.toString()).includes(currentUserId);

    if (!isLeaderOrCoLeader) {
      return NextResponse.json(
        { error: "Only leaders and co-leaders can manage join requests" },
        { status: 403 },
      );
    }

    // Find the specific join request
    const joinRequest = project.joinRequests.id(joinId);

    if (!joinRequest) {
      return NextResponse.json(
        { error: "Join request not found" },
        { status: 404 },
      );
    }

    if (joinRequest.status !== "pending") {
      return NextResponse.json(
        { error: "Join request was already processed" },
        { status: 400 },
      );
    }

    if (action === "accept") {
      joinRequest.status = "accepted";

      const reqUserIdStr = joinRequest.userId.toString();
      const isAlreadyInTeam =
        project.leaderId.toString() === reqUserIdStr ||
        project.coLeaders.map((uid) => uid.toString()).includes(reqUserIdStr) ||
        project.members.map((uid) => uid.toString()).includes(reqUserIdStr);

      if (!isAlreadyInTeam) {
        project.members.push(joinRequest.userId);
      }
    } else if (action === "reject") {
      joinRequest.status = "rejected";
    }

    await project.save();

    // Send Emails asynchronously
    (async () => {
      try {
        const requester = await User.findById(joinRequest.userId).select("email");
        if (requester && requester.email) {
          await sendJoinDecisionEmail({
            requesterEmail: requester.email,
            projectName: project.title,
            isAccepted: action === "accept",
            projectId: project._id.toString()
          });
        }
      } catch (err) {
        console.error("Error sending Join Decision Email:", err);
      }
    })();

    return NextResponse.json(
      { message: `Join request ${action}ed successfully` },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT /api/projects/[id]/join/[joinId] Error:", error);
    return NextResponse.json(
      { error: "Failed to process join request" },
      { status: 500 },
    );
  }
}
