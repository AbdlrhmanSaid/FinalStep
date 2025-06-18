import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const layout = async ({ children }) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }
  return <div>{children}</div>;
};

export default layout;
