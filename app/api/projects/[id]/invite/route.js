import dbConnect from "../../../../../lib/db";
import Project from "../../../../../models/Project";
import InviteRequest from "../../../../../models/InviteRequest";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";

export async function POST(request, context) {
  try {
    await dbConnect();
    const params = await context.params;
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

    const project = await Project.findById(id)
      .populate("leaderId")
      .populate("coLeaders")
      .populate("members");
      
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify auth
    const isAuthorized =
      project.leaderId._id.toString() === userId ||
      project.coLeaders.map((l) => l._id.toString()).includes(userId);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const existingMemberEmails = [];
    if (project.leaderId?.email) existingMemberEmails.push(project.leaderId.email);
    project.coLeaders.forEach(u => u.email && existingMemberEmails.push(u.email));
    project.members.forEach(u => u.email && existingMemberEmails.push(u.email));

    const existingMails = project.inviteRequests.map((r) => r.email);
    
    // Check if ALL provided emails are already in the project
    const allAlreadyMembers = emails.length > 0 && emails.every(e => existingMemberEmails.includes(e));
    if (allAlreadyMembers) {
      return NextResponse.json(
        { error: "جميع هؤلاء المستخدمين موجودون بالفعل في المشروع" },
        { status: 400 }
      );
    }
    
    const newEmails = emails.filter((email) => 
      !existingMails.includes(email) && 
      !existingMemberEmails.includes(email)
    );

    if (newEmails.length === 0) {
      return NextResponse.json(
        { message: "No new emails to invite", newEmails: [] },
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
      { message: "Invites sent successfully", newEmails },
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
