import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "../lib/queryProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"], // Include multiple weights for flexibility
});

export const metadata = {
  title: "Final Step | Project Management Platform",
  description: "Manage your projects, tasks, and teams easily with Final Step.",
  keywords: [
    "project management",
    "teamwork",
    "tasks",
    "Next.js",
    "Final Step",
  ],
  openGraph: {
    title: "Final Step",
    description: "Simplify your project management workflow.",
    url: "https://final-step.vercel.app",
    siteName: "Final Step",
    images: [
      {
        url: "https://final-step.vercel.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" dir="ltr">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} antialiased`}
        >
          <Toaster />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}

