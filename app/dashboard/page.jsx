"use client";

import dynamic from "next/dynamic";

const WelcomePage = dynamic(() => import("./WelcomePage"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      Loading dashboard...
    </div>
  ),
  ssr: false,
});

const Page = () => {
  return <WelcomePage />;
};

export default Page;
