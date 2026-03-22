import React from "react";
import { getFullUserOrRedirect } from "@/lib/getFullUser";
import QueryProvider from "@/lib/queryProvider";
import { AppProvider } from "@/contexts/AppContext";
import Navbar from "@/app/dashboard/components/Navbar";
import DashboardFooter from "@/app/dashboard/components/DashboardFooter";

export const metadata = {
  title: "Dashboard",
  description: "Modern bilingual project management dashboard",
};

const layout = async ({ children }) => {
  const user = await getFullUserOrRedirect();

  return (
    <QueryProvider>
      <AppProvider user={user}>
        <div className="antialiased min-h-screen flex flex-col">
          <nav>
            <Navbar />
          </nav>
          <main className="flex-1 dark:bg-gray-900">{children}</main>
          <footer>
            <DashboardFooter />
          </footer>
        </div>
      </AppProvider>
    </QueryProvider>
  );
};

export default layout;
