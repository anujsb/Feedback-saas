import React from "react";
import { SideBar } from "@/components/SideBar";
const page = () => {
  return (
    <div className="bg-[#faf9f8] text-black flex flex-col md:flex-row w-full min-h-screen">
      <SideBar />
      <div className="flex flex-1 flex-col items-center justify-center w-full">
        <div className="h-auto flex flex-1 flex-col items-center px-4 bg-background mt-10 w-full md:mt-20">
          <h1 className="mb-7 text-2xl md:text-3xl text-center text-black">
            Search Legal Insights in Seconds...
          </h1>
        </div>
      </div>
    </div>
  );
};

export default page;
