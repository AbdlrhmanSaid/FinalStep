import dbConnect from "../../../../../lib/db";
import Project from "../../../../../models/Project";
import { sendProjectNotificationEmail } from "../../../../../lib/emailService";
import { NextResponse } from "next/server";

export async function POST(request, context) {
  try {
    await dbConnect();
    const params = await context.params;
    const { id } = params;
    
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    
    const { userId, userName } = body;

    if (!userId || !userName) {
      return NextResponse.json({ error: "Missing sender info" }, { status: 400 });
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
      project.leaderId?._id?.toString() === userId ||
      project.coLeaders?.some((l) => l?._id?.toString() === userId);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Collect all emails
    const emails = [];
    if (project.leaderId?.email) emails.push(project.leaderId.email);
    project.coLeaders?.forEach(u => { if (u?.email) emails.push(u.email); });
    project.members?.forEach(u => { if (u?.email) emails.push(u.email); });

    // Deduplicate emails
    const uniqueEmails = [...new Set(emails)].filter(Boolean);

    if (uniqueEmails.length === 0) {
      return NextResponse.json({ error: "لا يوجد أعضاء بإيميلات صالحة للمراسلة" }, { status: 400 });
    }

    await sendProjectNotificationEmail({
      emails: uniqueEmails,
      projectName: project.title,
      projectId: project._id.toString(),
      senderName: userName
    });

    return NextResponse.json({ message: "Notification sent successfully", emailsCount: uniqueEmails.length }, { status: 200 });
  } catch (error) {
    console.error("POST /api/projects/[id]/notify Error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
