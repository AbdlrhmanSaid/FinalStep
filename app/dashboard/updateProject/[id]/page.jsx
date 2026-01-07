import dynamic from "next/dynamic";
import Loading from "../../../../components/Loading";

const UpdateProjectPage = dynamic(() => import("./UpdateProject"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      <Loading />
    </div>
  ),
  ssr: true,
});

const Page = () => {
  return <UpdateProjectPage />;
};

export default Page;
