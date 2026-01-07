import LandingPage from "../components/home/MainPage";

export const metadata = {
  title: "Final Step | إدارة المشاريع بسهولة",
  description:
    "منصة Final Step لإدارة المشاريع والمهام بكفاءة. نظم مشاريعك، تابع فريقك، وحقق أهدافك بسهولة.",
  keywords: [
    "إدارة المشاريع",
    "project management",
    "إدارة المهام",
    "task management",
    "العمل الجماعي",
    "teamwork",
    "Final Step",
    "فاينل ستيب",
  ],
  openGraph: {
    title: "Final Step | منصة إدارة المشاريع",
    description: "أسهل طريقة لإدارة مشاريعك ومهامك",
    url: "https://final-step.vercel.app",
    siteName: "Final Step",
    images: [
      {
        url: "https://final-step.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Final Step Platform",
      },
    ],
    locale: "ar_EG",
    alternateLocale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Final Step | منصة إدارة المشاريع",
    description: "أسهل طريقة لإدارة مشاريعك ومهامك",
    images: ["https://final-step.vercel.app/og-image.png"],
  },
  alternates: {
    canonical: "https://final-step.vercel.app",
  },
};

const page = () => {
  return <LandingPage />;
};

export default page;
