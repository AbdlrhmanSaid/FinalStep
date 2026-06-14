import React from "react";
import { getFullUserOrRedirect } from "@/lib/getFullUser";
import QueryProvider from "@/lib/queryProvider";
import { AppProvider } from "@/contexts/AppContext";
import Navbar from "@/app/dashboard/components/Navbar";
import DashboardFooter from "@/app/dashboard/components/DashboardFooter";
import AIChatPopup from "@/components/dashboard/AIChatPopup";

export const metadata = {
  title: "Dashboard",
  description: "Modern bilingual project management dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

const layout = async ({ children }) => {
  const user = await getFullUserOrRedirect();

  return (
    <QueryProvider>
      <AppProvider user={user}>
        <div className="antialiased min-h-screen flex flex-col font-arabic bg-white dark:bg-gray-950 relative">
          {/* Global Background Glows matching landing page */}
          <div className="fixed top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
          <div className="fixed bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
          
          <nav className="relative z-999 w-full overflow-visible">
            <Navbar />
          </nav>
          <main className="flex-1 relative z-10">
            {children}
          </main>
          <footer className="relative z-10">
            <DashboardFooter />
          </footer>
          <AIChatPopup />
        </div>
      </AppProvider>
    </QueryProvider>
  );
};

export default layout;
