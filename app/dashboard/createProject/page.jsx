"use client";

import dynamic from "next/dynamic";

const CreateProjectPage = dynamic(() => import("./CreateProjectPage"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      Loading project creator...
    </div>
  ),
  ssr: false,
});

const Page = () => {
  return <CreateProjectPage />;
};

export default Page;
