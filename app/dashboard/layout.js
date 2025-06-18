import React from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncClerkUser } from "../../lib/actions/syncClerkUser";

const layout = async ({ children }) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const clerkUser = await currentUser();

  await syncClerkUser(clerkUser);

  return <div>{children}</div>;
};

export default layout;
