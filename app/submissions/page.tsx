// "use client";

// import React, { useEffect, useState } from "react";
// import { SideBar } from "@/components/SideBar";
// import { cn } from "@/lib/utils";
// import { IconUserBolt } from "@tabler/icons-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { db } from "@/configs";
// import { submissions, jsonForms } from "@/configs/schema";
// import { eq } from "drizzle-orm";

// const SubmissionsPage = () => {
//   const [submissionData, setSubmissionData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchSubmissions();
//   }, []);

//   const fetchSubmissions = async () => {
//     try {
//       const result = await db.select({
//         submissionId: submissions.id,
//         formId: submissions.formId,
//         submissionData: submissions.submissionData,
//         createdAt: submissions.createdAt,
//         formTitle: jsonForms.jsonform
//       })
//       .from(submissions)
//       .leftJoin(jsonForms, eq(submissions.formId, jsonForms.id));
      
//       const processedData = result.map(item => ({
//         ...item,
//         submissionData: JSON.parse(item.submissionData),
//         formTitle: JSON.parse(item.formTitle).formTitle || 'Untitled Form'
//       }));
      
//       setSubmissionData(processedData);
//     } catch (error) {
//       console.error("Error fetching submissions:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading submissions...</div>;
//   }

//   return (
//     <div className={cn(" rounded-md flex flex-col md:flex-row flex-1 w-full overflow-hidden", "h-screen")}>
//       <SideBar />
//       <div className="flex flex-1 flex-col items-center m-20 w-full">
//         <div className="flex flex-col gap-4 w-full">
//           <h1 className="text-start text-2xl font-bold">Submissions</h1>
//           <div className="flex flex-row gap-4 mt-4">
//             <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full">
//               <IconUserBolt className=" h-5 w-5 flex-shrink-0" />
//               <h1>Total Submissions</h1>
//               <h1>{submissionData.length}</h1>
//             </div>
//             {/* Add more summary cards as needed */}
//           </div>
//           <div className="mt-4">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Form Title</TableHead>
//                   <TableHead>Submission Date</TableHead>
//                   <TableHead>Data</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {submissionData.map((submission) => (
//                   <TableRow key={submission.submissionId}>
//                     <TableCell>{submission.formTitle}</TableCell>
//                     <TableCell>{new Date(submission.createdAt).toLocaleString()}</TableCell>
//                     <TableCell>
//                       <pre>{JSON.stringify(submission.submissionData, null, 2)}</pre>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//               <TableFooter>
//                 <TableRow>
//                   <TableCell colSpan={2}>Total</TableCell>
//                   <TableCell className="text-right">{submissionData.length} Submissions</TableCell>
//                 </TableRow>
//               </TableFooter>
//             </Table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmissionsPage;



"use client";

import React, { useEffect, useState } from "react";
import { SideBar } from "@/components/SideBar";
import { cn } from "@/lib/utils";
import { IconUserBolt, IconLink, IconEdit } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/configs";
import { submissions, jsonForms } from "@/configs/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

const SubmissionsPage = () => {
  const [submissionData, setSubmissionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const result = await db
        .select({
          submissionId: submissions.id,
          formId: submissions.formId,
          submissionData: submissions.submissionData,
          createdAt: submissions.createdAt,
          formTitle: jsonForms.jsonform,
        })
        .from(submissions)
        .leftJoin(jsonForms, eq(submissions.formId, jsonForms.id));

      const processedData = result.map((item) => ({
        ...item,
        submissionData: JSON.parse(item.submissionData),
        formTitle: JSON.parse(item.formTitle).formTitle || "Untitled Form",
      }));

      setSubmissionData(processedData);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div
      className={cn(
        " rounded-md flex flex-col md:flex-row flex-1 w-full overflow-hidden",
        "h-screen"
      )}
    >
      <SideBar />
      <div className="flex flex-1 flex-col items-center m-20 w-full">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-start text-2xl font-bold">Submissions</h1>
          <div className="flex flex-row gap-4 mt-4">
            <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full">
              <IconUserBolt className=" h-5 w-5 flex-shrink-0" />
              <h1>Total Submissions</h1>
              <h1>{submissionData.length}</h1>
            </div>
            {/* Add more summary cards as needed */}
          </div>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form Title</TableHead>
                  <TableHead>Submission Count</TableHead>
                  <TableHead>Share Link</TableHead>
                  <TableHead>Edit</TableHead>
                  <TableHead>View Submissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionData.reduce((acc, submission) => {
                  const formIndex = acc.findIndex(
                    (item) => item.formId === submission.formId
                  );
                  if (formIndex === -1) {
                    acc.push({
                      formId: submission.formId,
                      formTitle: submission.formTitle,
                      submissionCount: 1,
                    });
                  } else {
                    acc[formIndex].submissionCount++;
                  }
                  return acc;
                }, []).map((formData) => (
                  <TableRow key={formData.formId}>
                    <TableCell>{formData.formTitle}</TableCell>
                    <TableCell>{formData.submissionCount}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/aiform/${formData.formId}`} target="_blank">
                          <IconLink className="cursor-pointer" />
                        </Link>
                        <Link href={`/embed/${formData.formId}`} target="_blank">
                          <IconLink className="cursor-pointer" />
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/edit-form/${formData.formId}`}>
                        <IconEdit className="cursor-pointer" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/submissions/${formData.formId}`}>
                        <IconLink className="cursor-pointer" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right">{submissionData.length} Submissions</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsPage;