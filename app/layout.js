import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import JsonLd from "../components/JsonLd";
import ScrollToTop from "../components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://final-step.vercel.app"),
  title: {
    default: "Final Step | Project Management Platform",
    template: "%s | Final Step",
  },
  description:
    "Manage your projects, tasks, and teams easily with Final Step. The ultimate platform for project management and team collaboration.",
  keywords: [
    "project management",
    "teamwork",
    "tasks",
    "collaboration",
    "Next.js",
    "Final Step",
    "إدارة المشاريع",
    "العمل الجماعي",
  ],
  authors: [{ name: "Final Step Team" }],
  creator: "Final Step",
  publisher: "Final Step",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Final Step | Project Management Platform",
    description: "Simplify your project management workflow.",
    url: "https://final-step.vercel.app",
    siteName: "Final Step",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Final Step Platform",
      },
    ],
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Final Step | Project Management Platform",
    description: "Simplify your project management workflow.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "geLAyuipWlwOYyOPDh4KQKVAj6BFRA7RXxkZLqLYins",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" data-scroll-behavior="smooth">
      <head>
        <JsonLd />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased font-sans`}>
        <Providers>
          <ScrollToTop />
          <Toaster />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
