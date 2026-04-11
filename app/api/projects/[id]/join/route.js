import dbConnect from "../../../../../lib/db";
import Project from "../../../../../models/Project";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { sendJoinRequestEmail } from "@/lib/emailService";

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const userId = request.headers.get("userId");

    let invite = false;
    try {
      const body = await request.json();
      if (body.invite) invite = true;
    } catch (e) {
      // Body might be empty
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 },
      );
    }

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.public && !invite) {
      return NextResponse.json(
        {
          error:
            "You cannot request to join a private project without an invite link",
        },
        { status: 403 },
      );
    }

    if (project.status === "finished") {
      return NextResponse.json(
        { error: "Project is already finished" },
        { status: 400 },
      );
    }

    // Check if user is already a member, leader, or co-leader
    const isAlreadyMember =
      project.leaderId.toString() === userId ||
      project.coLeaders.map((id) => id.toString()).includes(userId) ||
      project.members.map((id) => id.toString()).includes(userId);

    if (isAlreadyMember) {
      return NextResponse.json(
        { error: "Already a member of the project" },
        { status: 400 },
      );
    }

    // Check if user already requested
    const existingRequest = project.joinRequests.find(
      (req) => req.userId.toString() === userId && req.status === "pending",
    );

    if (existingRequest) {
      return NextResponse.json(
        { error: "Join request already sent" },
        { status: 400 },
      );
    }

    // Add join request
    project.joinRequests.push({
      userId: userId,
      status: "pending",
    });

    await project.save();

    // Send Emails asynchronously
    (async () => {
      try {
        const leaders = await User.find({ 
          _id: { $in: [project.leaderId, ...project.coLeaders] } 
        }).select("email");
        const requester = await User.findById(userId).select("name email");
        const leaderEmails = leaders.map(u => u.email).filter(Boolean);
        
        if (leaderEmails.length > 0 && requester) {
          await sendJoinRequestEmail({
            leaderEmails,
            projectName: project.title,
            requesterName: requester.name || requester.email,
            projectId: project._id.toString()
          });
        }
      } catch (err) {
        console.error("Error sending Join Request Emails:", err);
      }
    })();

    return NextResponse.json(
      { message: "Join request sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/projects/[id]/join Error:", error);
    return NextResponse.json(
      { error: "Failed to send join request" },
      { status: 500 },
    );
  }
}
