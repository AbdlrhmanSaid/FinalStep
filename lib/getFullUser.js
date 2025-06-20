// ✅ متوافق مع Clerk + MongoDB
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncClerkUser } from "./actions/syncClerkUser";
import { getCurrentUserData } from "./actions/user.actions";

export async function getFullUserOrRedirect() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const clerkUser = await currentUser();
  await syncClerkUser(clerkUser);

  const user = await getCurrentUserData(userId);

  if (!user) {
    redirect("/login");
  }

  return JSON.parse(JSON.stringify(user));
}
