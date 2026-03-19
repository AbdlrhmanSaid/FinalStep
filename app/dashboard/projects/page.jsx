import dynamic from "next/dynamic";
import Loading from "@/components/Loading";

export const metadata = {
  title: "Projects",
  description: "View and manage all your projects in one place.",
  robots: {
    index: false,
    follow: false,
  },
};

const ProjectsList = dynamic(() => import("./ProjectsList"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      <Loading />
    </div>
  ),
  ssr: true,
});

const Page = () => {
  return <ProjectsList />;
};

export default Page;
