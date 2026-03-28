import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getCurrentUserData } from "./actions/user.actions";

export async function getFullUserOrRedirect() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const user = await getCurrentUserData(userId);

  if (!user) {
    redirect("/login");
  }

  return JSON.parse(JSON.stringify(user));
}
