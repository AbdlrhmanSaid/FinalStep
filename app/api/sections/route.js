import dbConnect from "@/lib/db";
import Section from "@/models/Section";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const sections = await Section.find({ projectId }).populate("members", "name email");
    return NextResponse.json(sections, { status: 200 });
  } catch (error) {
    console.error("API Error in GET /api/sections:", error);
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, projectId, members = [], sectionRoles = {} } = body;

    if (!title || !projectId) {
      return NextResponse.json({ error: "title and projectId are required" }, { status: 400 });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Validation: ensure section.members is subset of project.members + leaders
    const allProjectMembers = [project.leaderId.toString(), ...project.coLeaders.map(cl => cl.toString()), ...project.members.map(m => m.toString())];
    
    for (const memberId of members) {
      if (!allProjectMembers.includes(memberId)) {
        return NextResponse.json({ error: `User ${memberId} is not a member of the project` }, { status: 400 });
      }
    }

    Object.keys(sectionRoles).forEach(userId => {
      if (!allProjectMembers.includes(userId)) {
        throw new Error(`Role assigned to user ${userId} who is not in project`);
      }
    });

    const section = await Section.create({
      title,
      projectId,
      members,
      sectionRoles
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error("API Error in POST /api/sections:", error);
    return NextResponse.json({ error: error.message || "Failed to create section" }, { status: 500 });
  }
}
