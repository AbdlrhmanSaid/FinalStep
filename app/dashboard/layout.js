import React from "react";
import { getFullUserOrRedirect } from "../../lib/getFullUser";
import QueryProvider from "../../lib/queryProvider";
import { AppProvider } from "../../contexts/AppContext";
import Navbar from "./components/Navbar";
import Footer from "../../components/home/Footer";

export const metadata = {
  title: "FinalStep Dashboard",
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
          <main className="flex-1">{children}</main>
          <footer>
            <Footer />
          </footer>
        </div>
      </AppProvider>
    </QueryProvider>
  );
};

export default layout;
