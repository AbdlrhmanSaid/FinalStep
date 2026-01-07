import dynamic from "next/dynamic";
import Loading from "../../components/Loading";

export const metadata = {
  title: "Dashboard",
  description: "Manage your projects and tasks from your personal dashboard.",
  robots: {
    index: false, // Dashboard pages shouldn't be indexed
    follow: false,
  },
};

const WelcomePage = dynamic(() => import("./WelcomePage"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      <Loading />
    </div>
  ),
  ssr: true, // Enable SSR for better performance
});

const Page = () => {
  return <WelcomePage />;
};

export default Page;
