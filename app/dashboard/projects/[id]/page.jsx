"use client";

import dynamic from "next/dynamic";

const ProjectDetailPage = dynamic(() => import("./ProjectDetailPage"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      Loading project details...
    </div>
  ),
  ssr: false,
});

const Page = () => {
  return <ProjectDetailPage />;
};

export default Page;
