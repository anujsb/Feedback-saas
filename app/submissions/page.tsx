import React from "react";
import { SideBar } from "@/components/SideBar";
import { cn } from "@/lib/utils";
import { IconUserBolt } from "@tabler/icons-react";
import {
  Table,
  TableBody,
//   TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <div className="flex flex-col gap-4 w-full">
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
            <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full ">
              <IconUserBolt className=" h-5 w-5 flex-shrink-0" />
              <h1>Good Ratings</h1>
              <h1>50</h1>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <h1 className="text-start text-2xl font-bold">AI Summary</h1>
            <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full">
              <h1>Summary</h1>
              <h1>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos.
              </h1>
            </div>
          </div>
          <div className="mt-4">
            <Table>
              {/* <TableCaption>
                <h1 className="text-start text-2xl font-bold">
                  Submissions
                </h1>
              </TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>john@doe.com</TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>Good</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Doe</TableCell>
                  <TableCell>jane@doe.com</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>Good</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">2 Feedbacks</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
