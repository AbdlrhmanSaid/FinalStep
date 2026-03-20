import dbConnect from "@/lib/db";
import User from "@/models/User";
import Task from "@/models/Task";
import Project from "@/models/Project";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Register models needed for populate
import "@/models/Project";
import "@/models/Task";

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

    // Both owner and visitors should see all projects
    const projectMatch = {};

    // Fetch user without project populations
    const user = await User.findById(id);

    // Fetch user's projects leading manually to ensure correctness
    const projectsLeading = await Project.find({
      leaderId: id,
      ...projectMatch,
    }).select("title status public deadline description");

    // Fetch user's projects as a member or co-leader manually
    const projectsMember = await Project.find({
      $or: [{ members: id }, { coLeaders: id }],
      ...projectMatch,
    }).select("title status public deadline description");

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
        .select(
          "title status priority dueDate createdAt projectId memberSubmissions",
        );

      // Fetch all tasks for both owner and visitor
      const allTasks = await taskQuery.populate({
        path: "projectId",
        select: "title public status",
      });
      // Keep only tasks with a projectId
      const validTasks = allTasks.filter((t) => t.projectId !== null);

      recentTasks = validTasks.slice(0, 10);
      completedTasks = validTasks
        .filter((t) => {
          if (t.status === "completed") return true;
          if (t.memberSubmissions && t.memberSubmissions.length > 0) {
            const mySub = t.memberSubmissions.find(
              (s) => (s.userId?._id || s.userId)?.toString() === id.toString(),
            );
            return mySub && mySub.status === "completed";
          }
          return false;
        })
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
          ? projectsLeading || []
          : [],
      projectsMember:
        isOwner || user.privacy?.showProjects !== false
          ? projectsMember || []
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
