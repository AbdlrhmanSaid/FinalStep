import ErrorState from "@/components/ErrorState";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 h-screen w-full bgMain">
      <div className="flex-1 flex items-center justify-center">
        <ErrorState type="notFound" />
      </div>
    </div>
  );
}
