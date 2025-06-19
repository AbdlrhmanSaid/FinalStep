import dbConnect from "../../../lib/db";
import User from "../../../models/User";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    return Response.json(users);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
