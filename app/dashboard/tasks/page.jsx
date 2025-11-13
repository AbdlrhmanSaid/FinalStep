"use client";

import dynamic from "next/dynamic";

const TasksPage = dynamic(() => import("./TasksPage"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      Loading tasks...
    </div>
  ),
  ssr: false,
});

const Page = () => {
  return <TasksPage />;
};

export default Page;
