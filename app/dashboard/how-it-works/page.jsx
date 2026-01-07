import HowItWorksClient from "./HowItWorksClient";

export const metadata = {
  title: "How It Works",
  description:
    "Learn how to use Final Step platform to manage your projects and collaborate with your team effectively.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}
