import { SideBar } from '@/components/SideBar'
import { cn } from '@/lib/utils'
import React from 'react'

export default function Dashboard() {
  return (
    <div
      className={cn(
        " rounded-md flex flex-col md:flex-row flex-1   w-full overflow-hidden",
        "h-screen"
      )}
    >
      {" "}
      <SideBar />
      <div className="flex flex-1 flex-col items-center justify-center w-full">
        Dashboard
      </div>
    </div>
  )
}
