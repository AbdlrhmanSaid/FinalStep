import React from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncClerkUser } from "../../lib/actions/syncClerkUser";
import { getCurrentUserData } from "../../lib/actions/user.actions";

export const metadata = {
  title: "FinalStep Dashboard",
  description: "Modern bilingual project management dashboard",
};
const layout = async ({ children }) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const clerkUser = await currentUser();
  await syncClerkUser(clerkUser);
  const user = await getCurrentUserData(userId);

  return (
    <>
      <div className="antialiased">{children}</div>
    </>
  );
};

export default layout;
