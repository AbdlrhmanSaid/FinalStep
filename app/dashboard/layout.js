import React from "react";
import { getFullUserOrRedirect } from "../../lib/getFullUser";
import QueryProvider from "../../lib/queryProvider";
import { AppProvider } from "../../contexts/AppContext";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "FinalStep Dashboard",
  description: "Modern bilingual project management dashboard",
};

const layout = async ({ children }) => {
  const user = await getFullUserOrRedirect();

  return (
    <QueryProvider>
      <AppProvider user={user}>
        <nav>
          <Navbar />
        </nav>
        <div className="antialiased">
          <main>{children}</main>
        </div>
      </AppProvider>
    </QueryProvider>
  );
};

export default layout;
