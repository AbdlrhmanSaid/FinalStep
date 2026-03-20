import { Users, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectHeader({
  data,
  content,
  isRTL,
  isFinished,
  handleRefresh,
  isRefetching,
}) {
  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
      <CardHeader className=" border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <CardTitle className="text-[14px] md:text-[24px] font-bold text-gray-800 dark:text-white">
              {data.title}
            </CardTitle>
            <button
              onClick={handleRefresh}
              disabled={isRefetching}
              className="p-2 ml-2 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 shadow-sm transition-all disabled:opacity-50 flex-shrink-0"
              title={isRTL ? "تحديث" : "Refresh"}
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefetching ? "animate-spin text-blue-500" : ""}`}
              />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={data.public ? "default" : "secondary"}
              className={`text-sm ${
                data.public
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {data.public ? content.public : content.private}
            </Badge>
            <Badge
              variant="secondary"
              className={`text-sm ${
                isFinished
                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                  : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              }`}
            >
              {isFinished ? content.statusFinished : content.statusOpen}
            </Badge>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
