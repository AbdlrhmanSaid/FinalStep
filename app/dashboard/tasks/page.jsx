"use client";

import dynamic from "next/dynamic";
import Loading from "../../../components/Loading";
const TasksPage = dynamic(() => import("./TasksPage"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      <Loading />
    </div>
  ),
  ssr: false,
});

const Page = () => {
  return <TasksPage />;
};

export default Page;

