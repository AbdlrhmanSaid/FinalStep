import { getAllUsers } from "@/lib/server/users";

export async function GET() {
  try {
    const users = await getAllUsers();
    return Response.json(users);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
