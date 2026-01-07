import dynamic from "next/dynamic";

const EditTaskPage = dynamic(() => import("./EditTaskPage"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      Loading task editor...
    </div>
  ),
  ssr: true,
});

const Page = () => {
  return <EditTaskPage />;
};

export default Page;
