"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col flex-1 h-screen w-full bgMain">
      <div className="flex-1 flex items-center justify-center">
        <ErrorState 
          type="general" 
          customMessage={error?.message} 
          refreshAction={() => reset()} 
        />
      </div>
    </div>
  );
}
