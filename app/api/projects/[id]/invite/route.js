import dbConnect from "../../../../../lib/db";
import Project from "../../../../../models/Project";
import InviteRequest from "../../../../../models/InviteRequest";
import { NextResponse } from "next/server";

export async function POST(request, context) {
  try {
    await dbConnect();
    const { params } = await context;
    const { id } = params;

    // Using formData or JSON depending on caller, UpdateTeam uses JSON
    const body = await request.json();
    const { emails, userId } = body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: "Emails array is required" },
        { status: 400 },
      );
    }

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify auth
    const isAuthorized =
      project.leaderId.toString() === userId ||
      project.coLeaders.map((lid) => lid.toString()).includes(userId);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const existingMails = project.inviteRequests.map((r) => r.email);
    const newEmails = emails.filter((email) => !existingMails.includes(email));

    if (newEmails.length === 0) {
      return NextResponse.json(
        { message: "No new emails to invite" },
        { status: 200 },
      );
    }

    // Add to InviteRequest
    const invites = newEmails.map((email) => ({
      email,
      projectId: id,
      invitedBy: userId,
      status: "pending",
    }));
    await InviteRequest.insertMany(invites);

    // Add to Project
    const newProjectInvites = newEmails.map((email) => ({ email }));
    await Project.findByIdAndUpdate(id, {
      $push: { inviteRequests: { $each: newProjectInvites } },
    });

    return NextResponse.json(
      { message: "Invites sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/projects/[id]/invite Error:", error);
    return NextResponse.json(
      { error: "Failed to send invites" },
      { status: 500 },
    );
  }
}
