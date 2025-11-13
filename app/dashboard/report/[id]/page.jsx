"use client";

import dynamic from "next/dynamic";

const ReportPage = dynamic(() => import("./ReportPage"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      Loading report...
    </div>
  ),
  ssr: false,
});

const Page = () => {
  return <ReportPage />;
};

export default Page;
