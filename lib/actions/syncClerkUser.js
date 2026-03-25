import dbConnect from "../db";
import User from "../../models/User";

export const syncClerkUser = async (clerkUser) => {
  await dbConnect();

  const existingUser = await User.findOne({ clerkId: clerkUser.id });

  if (!existingUser) {
    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    let name = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ");
    if (!name || name === "null null") {
      name = email.split("@")[0] || "Unknown User";
    }

    const newUser = await User.create({
      clerkId: clerkUser.id,
      name: name,
      email: email,
    });

    return newUser;
  }

  return existingUser;
};
