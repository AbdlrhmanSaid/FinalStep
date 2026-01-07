import dynamic from "next/dynamic";

const CreateTaskPage = dynamic(() => import("./CreateTaskPage"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      Loading task form...
    </div>
  ),
  ssr: true,
});

const Page = () => {
  return <CreateTaskPage />;
};

export default Page;
