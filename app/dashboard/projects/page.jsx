"use client";

import dynamic from "next/dynamic";

const ProjectsList = dynamic(() => import("./ProjectsList"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      Loading projects...
    </div>
  ),
  ssr: false,
});

const Page = () => {
  return <ProjectsList />;
};

export default Page;
