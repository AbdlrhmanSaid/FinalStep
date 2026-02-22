import dbConnect from "../../../../lib/db";
import User from "../../../../models/User";
import Task from "../../../../models/Task";
import Project from "../../../../models/Project";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Register models needed for populate
import "../../../../models/Project";
import "../../../../models/Task";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid or missing user ID" },
        { status: 400 },
      );
    }

    // Determine if the viewer is the profile owner
    const viewerId = request.headers.get("x-viewer-id");
    const isOwner =
      viewerId &&
      mongoose.Types.ObjectId.isValid(viewerId) &&
      viewerId.toString() === id.toString();

    // If the viewer is the owner → show ALL projects; otherwise only public ones
    const projectMatch = isOwner ? {} : { public: { $ne: false } };

    // Fetch user with projects populated
    const user = await User.findById(id)
      .populate({
        path: "projectsLeading",
        select: "title status public deadline description",
        match: projectMatch,
      })
      .populate({
        path: "projectsMember",
        select: "title status public deadline description",
        match: projectMatch,
      });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }



    // Fetch Clerk image URL (server-side, uses secret key)
    let imageUrl = null;
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(user.clerkId);
      imageUrl = clerkUser.imageUrl ?? null;
    } catch {
      // Clerk lookup failed - just skip the image
      imageUrl = null;
    }

    // Fetch tasks — owner sees all, others only see tasks from public projects
    // Also respect showTasks privacy setting for non-owners
    let recentTasks = [];
    let completedTasks = [];
    const canSeeTasks = isOwner || user.privacy?.showTasks !== false;

    if (canSeeTasks) {
      const taskQuery = Task.find({ assignedTo: user._id })
        .sort({ createdAt: -1 })
        .limit(30)
        .select("title status priority dueDate createdAt projectId");

      let allTasks;
      if (isOwner) {
        // Owner: populate all projects (public and private)
        allTasks = await taskQuery.populate({
          path: "projectId",
          select: "title public status",
        });
        // For owner, keep all tasks with a projectId
        allTasks = allTasks.filter((t) => t.projectId !== null);
      } else {
        // Others: only tasks from public projects
        allTasks = await taskQuery.populate({
          path: "projectId",
          select: "title public",
          match: { public: { $ne: false } },
        });
        allTasks = allTasks.filter((t) => t.projectId !== null);
      }

      recentTasks = allTasks.slice(0, 10);
      completedTasks = allTasks
        .filter((t) => t.status === "completed")
        .slice(0, 10);


    }

    const publicProfile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title || "",
      imageUrl,
      links: {
        linkedin: user.links?.linkedin || "",
        github: user.links?.github || "",
        facebook: user.links?.facebook || "",
        custom: user.links?.custom || [],
      },
      privacy: {
        showProjects: user.privacy?.showProjects ?? true,
        showTasks: user.privacy?.showTasks ?? true,
      },
      // Owner always sees all their projects; privacy only hides from others
      projectsLeading:
        isOwner || user.privacy?.showProjects !== false
          ? user.projectsLeading || []
          : [],
      projectsMember:
        isOwner || user.privacy?.showProjects !== false
          ? user.projectsMember || []
          : [],
      recentTasks,
      completedTasks,
      createdAt: user.createdAt,
    };

    return NextResponse.json(publicProfile, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
