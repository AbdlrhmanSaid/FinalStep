import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import Project from "../../../models/Project";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    if (!query.trim()) {
      return NextResponse.json({ users: [], projects: [] }, { status: 200 });
    }

    const regex = new RegExp(query, "i");

    // Search users by name, email, or title
    const users = await User.find({
      $or: [{ name: regex }, { email: regex }, { title: regex }],
    })
      .select("name email title role links")
      .limit(20)
      .lean();

    // Search public projects by title or description
    const projects = await Project.find({
      public: true,
      $or: [{ title: regex }, { description: regex }],
    })
      .populate("leaderId", "name email")
      .select(
        "title description leaderId createdAt status deadline tasks members",
      )
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ users, projects }, { status: 200 });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 },
    );
  }
}
