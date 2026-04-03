import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Section from "@/models/Section";
import Project from "@/models/Project";
import User from "@/models/User"; // Required for population
import mongoose from "mongoose";

// GET /api/projects/[id]/sections - List all sections
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid Project ID" }, { status: 400 });

    const sections = await Section.find({ projectId: id })
      .populate("members", "name image email role title")
      .populate("joinRequests", "name image email role title");
    
    return NextResponse.json(sections);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/projects/[id]/sections - Create a section
export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const userId = req.headers.get("userId");
    const { title, description } = await req.json();

    if (!title?.trim())
      return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const project = await Project.findById(id).select("leaderId coLeaders");
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const isLeader = 
      project.leaderId.toString() === userId || 
      project.coLeaders.some(c => c.toString() === userId);
    
    if (!isLeader) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const newSection = await Section.create({
      title: title.trim(),
      description: description?.trim() || "",
      projectId: id,
      members: [],
      joinRequests: [],
      sectionRoles: {}
    });

    return NextResponse.json(newSection, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
