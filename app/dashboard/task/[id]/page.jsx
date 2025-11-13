"use client";

import dynamic from "next/dynamic";

const TaskDetailPage = dynamic(() => import("./TaskDetailPage"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      Loading task details...
    </div>
  ),
  ssr: false,
});

const Page = () => {
  return <TaskDetailPage />;
};

export default Page;
