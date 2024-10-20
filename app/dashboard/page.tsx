import { SideBar } from "@/components/SideBar";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      {" "}
      <SideBar />
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-1 flex-col items-center justify-center w-full h-screen">
          <div>
            <h1>heading
              
            </h1>
            <Button>edit</Button>
            <Button>Share</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
