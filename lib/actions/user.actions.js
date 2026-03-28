import User from "../../models/User";
import Project from "../../models/Project";
import dbConnect from "../db";

export const getCurrentUserData = async (userId) => {
  try {
    await dbConnect();

    const userDoc = await User.findById(userId).lean();
    if (!userDoc) return null;

    const projectsLeading = await Project.find({
      leaderId: userDoc._id,
    }).lean();
    const projectsMember = await Project.find({
      $or: [{ members: userDoc._id }, { coLeaders: userDoc._id }],
    }).lean();

    return {
      ...userDoc,
      projectsLeading,
      projectsMember,
    };
  } catch (error) {
    console.error("Error getting current user data:", error);
    return null;
  }
};
