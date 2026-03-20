import dynamic from "next/dynamic";
import Loading from "@/components/Loading";

const UpdateTeamPage = dynamic(() => import("./UpdateTeam"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      <Loading />
    </div>
  ),
  ssr: true,
});

const Page = () => {
  return <UpdateTeamPage />;
};

export default Page;
