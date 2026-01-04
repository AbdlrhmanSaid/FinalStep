import { getUserProjects } from "@/lib/server/projects";

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
