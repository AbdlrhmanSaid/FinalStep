import dynamic from "next/dynamic";
import Loading from "../../../components/Loading";

export const metadata = {
  title: "Invitations",
  description: "Manage your project invitations and join new teams.",
  robots: {
    index: false,
    follow: false,
  },
};

const InvitationsPage = dynamic(() => import("./InvitationsPage"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      <Loading />
    </div>
  ),
  ssr: true,
});

const Page = () => {
  return <InvitationsPage />;
};

export default Page;
