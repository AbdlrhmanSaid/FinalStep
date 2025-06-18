import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

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
  title: "FinalStep - Graduation Project Management",
  description:
    "The ultimate platform for students to manage and collaborate on graduation projects.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" dir="ltr">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} antialiased`}
        >
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
