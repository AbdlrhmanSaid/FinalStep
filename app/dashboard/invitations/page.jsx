"use client";

import dynamic from "next/dynamic";

const InvitationsPage = dynamic(() => import("./InvitationsPage"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      Loading invitations...
    </div>
  ),
  ssr: false,
});

const Page = () => {
  return <InvitationsPage />;
};

export default Page;
