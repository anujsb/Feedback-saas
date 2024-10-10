import React from "react";
import { SideBar } from "@/components/SideBar";
import { cn } from "@/lib/utils";
import { IconUserBolt } from "@tabler/icons-react";
const page = () => {
  return (
    <div
      className={cn(
        " rounded-md flex flex-col md:flex-row flex-1   w-full overflow-hidden",
        "h-screen"
      )}
    >
      {" "}
      <SideBar />
      <div className="flex flex-1 flex-col items-center m-20 w-full">
        <div>

          <h1 className="text-start text-2xl font-bold">Submissions</h1>
          <div className="flex flex-row gap-4 mt-4">
            <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full">
              <IconUserBolt className=" h-5 w-5 flex-shrink-0" />
              <h1>Total Feedbacks</h1>
              <h1>100</h1>
            </div>
            <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full">
              <IconUserBolt className=" h-5 w-5 flex-shrink-0" />
              <h1>Bad Ratings</h1>
              <h1>50</h1>
            </div>
            <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full">
              <IconUserBolt className=" h-5 w-5 flex-shrink-0" />
              <h1>Good Ratings</h1>
              <h1>50</h1>
            </div>
          </div>
          <div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
