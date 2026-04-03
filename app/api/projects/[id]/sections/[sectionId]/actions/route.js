import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Section from "@/models/Section";
import Project from "@/models/Project";
import mongoose from "mongoose";

// POST /api/projects/[id]/sections/[sectionId]/actions
// body: { action: "join" | "leave" | "approve" | "reject", targetUserId?: string }
export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id: projectId, sectionId } = await params;
    const userId = req.headers.get("userId");
    const { action, targetUserId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(sectionId))
      return NextResponse.json({ error: "Invalid Section ID" }, { status: 400 });

    const section = await Section.findById(sectionId);
    if (!section) return NextResponse.json({ error: "Section not found" }, { status: 404 });

    const project = await Project.findById(projectId).select("leaderId coLeaders members");
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const isMemberOfProject = 
      project.leaderId?.toString() === userId || 
      project.coLeaders?.some(c => c.toString() === userId) ||
      project.members?.some(m => m.toString() === userId);
    
    if (!isMemberOfProject) return NextResponse.json({ error: "You must be a project member" }, { status: 403 });

    const isLeader = 
      project.leaderId?.toString() === userId || 
      project.coLeaders?.some(c => c.toString() === userId);

    if (action === "join") {
      // Add to joinRequests
      if (section.members?.some(m => m.toString() === userId))
        return NextResponse.json({ error: "Already a member" }, { status: 400 });
      if (section.joinRequests?.some(r => r.toString() === userId))
        return NextResponse.json({ error: "Join request already pending" }, { status: 400 });

      // If user is already in another section in this project?
      // User says "so they know which section they are in" - maybe allow only one?
      // For now, allow multiple, but usually one is enough.
      
      await Section.findByIdAndUpdate(sectionId, { $addToSet: { joinRequests: userId } });
      return NextResponse.json({ message: "Join request sent" });
    }

    if (action === "leave") {
      await Section.findByIdAndUpdate(sectionId, { 
        $pull: { members: userId },
        $unset: { [`sectionRoles.${userId}`]: "" }
      });
      return NextResponse.json({ message: "Left section successfully" });
    }

    if (action === "approve") {
      if (!isLeader) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      if (!targetUserId) return NextResponse.json({ error: "targetUserId required" }, { status: 400 });

      await Section.findByIdAndUpdate(sectionId, {
        $pull: { joinRequests: targetUserId },
        $addToSet: { members: targetUserId }
      });
      return NextResponse.json({ message: "Member approved" });
    }

    if (action === "reject") {
      if (!isLeader) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      if (!targetUserId) return NextResponse.json({ error: "targetUserId required" }, { status: 400 });

      await Section.findByIdAndUpdate(sectionId, {
        $pull: { joinRequests: targetUserId }
      });
      return NextResponse.json({ message: "Member request rejected" });
    }
    
    // Admin only Section removal
    if (action === "delete") {
      if (!isLeader) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      await Section.findByIdAndDelete(sectionId);
      return NextResponse.json({ message: "Section deleted" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
