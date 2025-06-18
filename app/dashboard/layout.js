import React from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncClerkUser } from "../../lib/actions/syncClerkUser";
import { getCurrentUserData } from "../../lib/actions/user.actions";

const layout = async ({ children }) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const clerkUser = await currentUser();
  await syncClerkUser(clerkUser);
  const user = await getCurrentUserData(userId);

  return (
    <div className="p-3">
      <h1>name : {user.name}</h1>
      <h1>email : {user.email}</h1>
      <h1>projectsLeading : {user.projectsLeading.length}</h1>
      <h1>projectsMember : {user.projectsMember.length}</h1>
    </div>
  );
};

export default layout;
