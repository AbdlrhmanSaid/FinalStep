import dynamic from "next/dynamic";
import Loading from "@/components/Loading";

export const metadata = {
  title: "Search",
  description: "Search for users and public projects",
};

const SearchContent = dynamic(() => import("./SearchContent"), {
  loading: () => (
    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
      <Loading />
    </div>
  ),
});

export default function SearchPage() {
  return <SearchContent />;
}
