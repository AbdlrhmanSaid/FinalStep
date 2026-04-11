import { getUserProjects, createProject } from "@/lib/server/projects";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const userId = req.headers.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const projects = await getUserProjects(userId);
    return Response.json(projects, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const body = await req.json();
    
    // Ensure the leaderId is the one who created it if not provided
    if (!body.leaderId) {
      body.leaderId = userId;
    }

    const project = await createProject(body);
    // Convert to regular object to ensure proper JSON serialization
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("API POST Project Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
