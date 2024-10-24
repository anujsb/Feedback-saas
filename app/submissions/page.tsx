// "use client";

// import React, { useEffect, useState } from "react";
// import { SideBar } from "@/components/SideBar";
// import { cn } from "@/lib/utils";
// import {
//   IconUserBolt,
//   IconLink,
//   IconEdit,
//   IconSearch,
// } from "@tabler/icons-react";
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
// import { eq, sql, and } from "drizzle-orm";
// import Link from "next/link";
// import moment from "moment";
// import { Button } from "@/components/ui/button";
// import { ArrowRightIcon, FileJson } from "lucide-react";
// import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser for authentication
// import Image from "next/image";

// const SubmissionsPage = () => {
//   const { user } = useUser(); // Get the current logged-in user
//   const [formsData, setFormsData] = useState<any[]>([]);
//   const [filteredForms, setFilteredForms] = useState<any[]>([]);
//   const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     if (user) {
//       fetchForms();
//     }
//   }, [user]);

//   useEffect(() => {
//     filterFormsByTitle(searchQuery);
//   }, [searchQuery, formsData]);

//   const fetchForms = async () => {
//     try {
//       const result = await db
//         .select({
//           formId: jsonForms.id,
//           jsonform: jsonForms.jsonform,
//           createdAt: jsonForms.createdAt,
//           submissionCount: sql<number>`COUNT(${submissions.id})`,
//         })
//         .from(jsonForms)
//         .leftJoin(submissions, eq(jsonForms.id, submissions.formId))
//         .where(
//           eq(jsonForms.createdBy, user?.primaryEmailAddress?.emailAddress) // Filter by current user's email
//         )
//         .groupBy(jsonForms.id, jsonForms.jsonform, jsonForms.createdAt)
//         .orderBy(sql`COUNT(${submissions.id}) DESC`);

//       const processedData = result.map((form) => {
//         const parsedForm = JSON.parse(form.jsonform);

//         let createdAt = "N/A";
//         if (form.createdAt) {
//           // Attempt parsing various formats (e.g., ISO 8601, Unix)
//           const momentDate = moment(form.createdAt, [
//             moment.ISO_8601,
//             "YYYY-MM-DD HH:mm:ss",
//             "YYYY-MM-DD",
//           ]);

//           createdAt = momentDate.isValid()
//             ? momentDate.format("DD/MM/YYYY") // Output format you want
//             : "Invalid Date Format"; // Fallback for invalid dates
//         } else {
//           createdAt = "N/A"; // Handle missing dates
//         }

//         return {
//           formId: form.formId,
//           formTitle: parsedForm.formTitle || "Untitled Form",
//           createdAt: createdAt,
//           submissionCount: Number(form.submissionCount),
//         };
//       });

//       const total = processedData.reduce(
//         (sum, form) => sum + form.submissionCount,
//         0
//       );

//       setFormsData(processedData);
//       setFilteredForms(processedData);
//       setTotalSubmissions(total);
//     } catch (error) {
//       console.error("Error fetching forms:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterFormsByTitle = (query: string) => {
//     const lowercasedQuery = query.toLowerCase();
//     const filtered = formsData.filter((form) =>
//       form.formTitle.toLowerCase().includes(lowercasedQuery)
//     );
//     setFilteredForms(filtered);
//   };

//   if (loading) {
//     return (
//       <div className="w-full h-screen flex flex-col items-center justify-center">
//         <Image src="/Loadertrans.gif" alt="my gif" height={150} width={150} />
//         Loading forms...
//       </div>
//     );
//   }

//   return (
//     <div
//       className={cn(
//         "rounded-md flex flex-col md:flex-row flex-1 w-full overflow-hidden",
//         "h-full"
//       )}
//     >
//       <SideBar />
//       <div className="flex flex-1 flex-col items-center m-20 w-full">
//         <div className="flex flex-col gap-4 w-full">
//           <h1 className="text-start text-2xl font-bold">Forms & Submissions</h1>

//           <div className="flex flex-row gap-4 mt-4 ">
//             <div className="relative w-full">
//               <input
//                 type="text"
//                 placeholder="Search by form title..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="border border-accent rounded-md p-2 pl-10 w-full bg-primary"
//               />
//               <IconSearch className="absolute left-3 top-2.5 text-text h-5 w-5" />
//             </div>
//           </div>

//           <div className="flex flex-row gap-4 mt-4">
//             <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full">
//               <IconUserBolt className="h-5 w-5 flex-shrink-0" />
//               <h1>Total Forms</h1>
//               <h1>{filteredForms.length}</h1>
//             </div>
//             <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full">
//               <IconUserBolt className="h-5 w-5 flex-shrink-0" />
//               <h1>Total Submissions</h1>
//               <h1>{totalSubmissions}</h1>
//             </div>
//           </div>

//           <div className="mt-4">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="text-center">Form Title</TableHead>
//                   <TableHead className="text-center">Created Date</TableHead>
//                   <TableHead className="text-center">Submission Count</TableHead>
//                   <TableHead className="text-center">Live Link</TableHead>
//                   <TableHead className="text-center">Embed Link</TableHead>
//                   <TableHead className="text-center">Edit</TableHead>
//                   <TableHead className="text-center">View Submissions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredForms.map((form) => (
//                   <TableRow key={form.formId}>
//                     <TableCell className="text-start">{form.formTitle}</TableCell>
//                     <TableCell className="text-center">{form.createdAt}</TableCell>
//                     <TableCell className="text-center">
//                       {form.submissionCount}
//                     </TableCell>
//                     <TableCell className="text-center">
//                       <Link href={`/aiform/${form.formId}`} target="_blank">
//                         <Button variant="outline" className="border-secondary">
//                           <IconLink className="cursor-pointer h-4 w-4" />
//                         </Button>
//                       </Link>
//                     </TableCell>
//                     <TableCell className="text-center">
//                       <Link href={`/embed/${form.formId}`} target="_blank">
//                         <Button variant="outline" className="border-secondary">
//                           <FileJson className="cursor-pointer h-4 w-4" />
//                         </Button>
//                       </Link>
//                     </TableCell>
//                     <TableCell className="text-center">
//                       <Link href={`/edit-form/${form.formId}`}>
//                         <Button variant="outline" className="border-secondary">
//                           <IconEdit className="cursor-pointer h-4 w-4" />
//                         </Button>
//                       </Link>
//                     </TableCell>
//                     <TableCell className="text-center">
//                       <Link href={`/submissions/${form.formId}`}>
//                         <Button variant="outline" className="border-secondary">
//                           <ArrowRightIcon className="cursor-pointer h-4 w-4" />
//                         </Button>
//                       </Link>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//               <TableFooter>
//                 <TableRow>
//                   <TableCell colSpan={2}>Total</TableCell>
//                   <TableCell>{totalSubmissions} Submissions</TableCell>
//                   <TableCell colSpan={4}></TableCell>
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

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SideBar } from "@/components/SideBar";
import { cn } from "@/lib/utils";
import { IconUserBolt, IconLink, IconEdit, IconSearch } from "@tabler/icons-react";
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
import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, FileJson } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

// Type definitions
interface FormData {
  formId: number;
  formTitle: string;
  createdAt: string;
  submissionCount: number;
}

// Define the exact structure of your JSON form
interface JsonFormData {
  formTitle: string;
  fields: Array<{
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  }>;
  settings: {
    allowMultipleSubmissions: boolean;
    submitButtonText: string;
    confirmationMessage: string;
  };
}

interface DbQueryResult {
  formId: number;
  jsonform: string;
  createdAt: string | null;
  submissionCount: number;
}

// Component Props Types
interface StatCardProps {
  icon: React.FC<{ className?: string }>;
  title: string;
  value: number | string;
}

interface ActionButtonProps {
  href: string;
  icon: React.FC<{ className?: string }>;
}

// Separate components
const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value }) => (
  <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full">
    <Icon className="h-5 w-5 flex-shrink-0" />
    <h1>{title}</h1>
    <h1>{value}</h1>
  </div>
);

const ActionButton: React.FC<ActionButtonProps> = ({ href, icon: Icon }) => (
  <Link href={href} target="_blank">
    <Button variant="outline" className="border-secondary">
      <Icon className="cursor-pointer h-4 w-4" />
    </Button>
  </Link>
);

const LoadingSpinner: React.FC = () => (
  <div className="w-full h-screen flex flex-col items-center justify-center">
    <Image src="/Loadertrans.gif" alt="Loading" height={150} width={150} priority />
    Loading forms...
  </div>
);

const SubmissionsPage: React.FC = () => {
  const { user } = useUser();
  const [formsData, setFormsData] = useState<FormData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredForms = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return formsData.filter((form) =>
      form.formTitle.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, formsData]);

  const totalSubmissions = useMemo(() => 
    formsData.reduce((sum, form) => sum + form.submissionCount, 0),
    [formsData]
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const formatDate = useCallback((date: string | null): string => {
    if (!date) return "N/A";
    const momentDate = moment(date);
    return momentDate.isValid() ? momentDate.format("DD/MM/YYYY") : "Invalid Date";
  }, []);

  const parseJsonForm = (jsonString: string): JsonFormData => {
    try {
      const parsed = JSON.parse(jsonString) as JsonFormData;
      // Validate the required properties
      if (typeof parsed.formTitle !== 'string') {
        throw new Error('Invalid form title');
      }
      return parsed;
    } catch {
      // Return a default form structure if parsing fails
      return {
        formTitle: "Untitled Form",
        fields: [],
        settings: {
          allowMultipleSubmissions: false,
          submitButtonText: "Submit",
          confirmationMessage: "Thank you for your submission",
        },
      };
    }
  };

  const processQueryResult = useCallback((result: DbQueryResult): FormData => {
    const parsedForm = parseJsonForm(result.jsonform);
    
    return {
      formId: result.formId,
      formTitle: parsedForm.formTitle,
      createdAt: formatDate(result.createdAt),
      submissionCount: Number(result.submissionCount),
    };
  }, [formatDate]);

  const fetchForms = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      const result = await db
        .select({
          formId: jsonForms.id,
          jsonform: jsonForms.jsonform,
          createdAt: jsonForms.createdAt,
          submissionCount: sql<number>`COUNT(${submissions.id})`,
        })
        .from(jsonForms)
        .leftJoin(submissions, eq(jsonForms.id, submissions.formId))
        .where(eq(jsonForms.createdBy, user.primaryEmailAddress.emailAddress))
        .groupBy(jsonForms.id, jsonForms.jsonform, jsonForms.createdAt)
        .orderBy(sql`COUNT(${submissions.id}) DESC`);

      const processedData = result.map((item: DbQueryResult) => processQueryResult(item));
      setFormsData(processedData);
    } catch (error) {
      console.error("Error fetching forms:", error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [user?.primaryEmailAddress?.emailAddress, processQueryResult]);

  useEffect(() => {
    if (user) {
      fetchForms();
    }
  }, [user, fetchForms]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className={cn("rounded-md flex flex-col md:flex-row flex-1 w-full overflow-hidden", "h-full")}>
      <SideBar />
      <div className="flex flex-1 flex-col items-center m-20 w-full">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-start text-2xl font-bold">Forms & Submissions</h1>

          <div className="relative w-full mt-4">
            <input
              type="text"
              placeholder="Search by form title..."
              value={searchQuery}
              onChange={handleSearch}
              className="border border-accent rounded-md p-2 pl-10 w-full bg-primary"
            />
            <IconSearch className="absolute left-3 top-2.5 text-text h-5 w-5" />
          </div>

          <div className="flex flex-row gap-4 mt-4">
            <StatCard icon={IconUserBolt} title="Total Forms" value={filteredForms.length} />
            <StatCard icon={IconUserBolt} title="Total Submissions" value={totalSubmissions} />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Form Title</TableHead>
                <TableHead className="text-center">Created Date</TableHead>
                <TableHead className="text-center">Submission Count</TableHead>
                <TableHead className="text-center">Live Link</TableHead>
                <TableHead className="text-center">Embed Link</TableHead>
                <TableHead className="text-center">Edit</TableHead>
                <TableHead className="text-center">View Submissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.map((form) => (
                <TableRow key={form.formId}>
                  <TableCell className="text-start">{form.formTitle}</TableCell>
                  <TableCell className="text-center">{form.createdAt}</TableCell>
                  <TableCell className="text-center">{form.submissionCount}</TableCell>
                  <TableCell className="text-center">
                    <ActionButton href={`/aiform/${form.formId}`} icon={IconLink} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ActionButton href={`/embed/${form.formId}`} icon={FileJson} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ActionButton href={`/edit-form/${form.formId}`} icon={IconEdit} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ActionButton href={`/submissions/${form.formId}`} icon={ArrowRightIcon} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell>{totalSubmissions} Submissions</TableCell>
                <TableCell colSpan={4}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsPage;