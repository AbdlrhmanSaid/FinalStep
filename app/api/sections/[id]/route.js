import dbConnect from "@/lib/db";
import Section from "@/models/Section";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const section = await Section.findById(id);
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const project = await Project.findById(section.projectId);
    if (body.members || body.sectionRoles) {
        const allProjectMembers = [project.leaderId.toString(), ...project.coLeaders.map(cl => cl.toString()), ...project.members.map(m => m.toString())];
        
        if (body.members) {
            for (const memberId of body.members) {
            if (!allProjectMembers.includes(memberId)) {
                return NextResponse.json({ error: `User ${memberId} is not a member of the project` }, { status: 400 });
            }
            }
        }
        
        if (body.sectionRoles) {
            Object.keys(body.sectionRoles).forEach(userId => {
            if (!allProjectMembers.includes(userId)) {
                throw new Error(`Role assigned to user ${userId} who is not in project`);
            }
            });
        }
    }

    const updatedSection = await Section.findByIdAndUpdate(id, { $set: body }, { new: true });
    return NextResponse.json(updatedSection, { status: 200 });
  } catch (error) {
    console.error("API Error in PUT /api/sections/[id]:", error);
    return NextResponse.json({ error: error.message || "Failed to update section" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const section = await Section.findById(id);
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    if (section.isDefault) {
      return NextResponse.json({ error: "Cannot delete the default section" }, { status: 400 });
    }

    // The post hook on Section model will cascade delete tasks
    await Section.findByIdAndDelete(id);

    return NextResponse.json({ message: "Section deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("API Error in DELETE /api/sections/[id]:", error);
    return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
  }
}
