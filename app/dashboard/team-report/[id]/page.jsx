"use client";

import dynamic from "next/dynamic";
import Loading from "@/components/Loading";

const TeamReportPage = dynamic(() => import("./TeamReportPage"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      <Loading />
    </div>
  ),
});

const Page = () => {
  return <TeamReportPage />;
};

export default Page;
