// lib/actions/syncClerkUser.ts
import dbConnect from "../db";
import User from "../../models/User";

export const syncClerkUser = async (clerkUser) => {
  await dbConnect();

  const existingUser = await User.findOne({ clerkId: clerkUser.id });

  if (!existingUser) {
    const newUser = await User.create({
      clerkId: clerkUser.id,
      name: clerkUser.firstName + " " + clerkUser.lastName,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
    });

    return newUser;
  }

  return existingUser;
};
