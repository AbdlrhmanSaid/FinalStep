import dynamic from "next/dynamic";
import Loading from "../../../components/Loading";

export const metadata = {
  title: "Tasks",
  description: "View and manage all your tasks efficiently.",
  robots: {
    index: false,
    follow: false,
  },
};

const TasksPage = dynamic(() => import("./TasksPage"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      <Loading />
    </div>
  ),
  ssr: true,
});

const Page = () => {
  return <TasksPage />;
};

export default Page;
