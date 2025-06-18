import User from "../../models/User";
import Project from "../../models/Project"; // 👈 ضروري علشان تسجل الموديل
import dbConnect from "../db";

export const getCurrentUserData = async (clerkUserId) => {
  try {
    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUserId })
      .populate("projectsLeading")
      .populate("projectsMember");

    return user;
  } catch (error) {
    console.error("Error getting current user data:", error);
    return null;
  }
};
