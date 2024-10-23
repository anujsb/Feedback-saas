"use client";

import React, { useEffect, useState } from "react";
import { SideBar } from "@/components/SideBar";
import { cn } from "@/lib/utils";
import {
  IconUserBolt,
  IconLink,
  IconEdit,
  IconSearch,
} from "@tabler/icons-react";
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
import { eq, sql, and } from "drizzle-orm";
import Link from "next/link";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, FileJson } from "lucide-react";
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser for authentication
import Image from "next/image";

const SubmissionsPage = () => {
  const { user } = useUser(); // Get the current logged-in user
  const [formsData, setFormsData] = useState<any[]>([]);
  const [filteredForms, setFilteredForms] = useState<any[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetchForms();
    }
  }, [user]);

  useEffect(() => {
    filterFormsByTitle(searchQuery);
  }, [searchQuery, formsData]);

  const fetchForms = async () => {
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
        .where(
          eq(jsonForms.createdBy, user?.primaryEmailAddress?.emailAddress) // Filter by current user's email
        )
        .groupBy(jsonForms.id, jsonForms.jsonform, jsonForms.createdAt)
        .orderBy(sql`COUNT(${submissions.id}) DESC`);

      const processedData = result.map((form) => {
        const parsedForm = JSON.parse(form.jsonform);

        let createdAt = "N/A";
        if (form.createdAt) {
          // Attempt parsing various formats (e.g., ISO 8601, Unix)
          const momentDate = moment(form.createdAt, [
            moment.ISO_8601,
            "YYYY-MM-DD HH:mm:ss",
            "YYYY-MM-DD",
          ]);

          createdAt = momentDate.isValid()
            ? momentDate.format("DD/MM/YYYY") // Output format you want
            : "Invalid Date Format"; // Fallback for invalid dates
        } else {
          createdAt = "N/A"; // Handle missing dates
        }

        return {
          formId: form.formId,
          formTitle: parsedForm.formTitle || "Untitled Form",
          createdAt: createdAt,
          submissionCount: Number(form.submissionCount),
        };
      });

      const total = processedData.reduce(
        (sum, form) => sum + form.submissionCount,
        0
      );

      setFormsData(processedData);
      setFilteredForms(processedData);
      setTotalSubmissions(total);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterFormsByTitle = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = formsData.filter((form) =>
      form.formTitle.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredForms(filtered);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Image src="/Loadertrans.gif" alt="my gif" height={150} width={150} />
        Loading forms...
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row flex-1 w-full overflow-hidden",
        "h-full"
      )}
    >
      <SideBar />
      <div className="flex flex-1 flex-col items-center m-20 w-full">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-start text-2xl font-bold">Forms & Submissions</h1>

          <div className="flex flex-row gap-4 mt-4 ">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by form title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-accent rounded-md p-2 pl-10 w-full bg-primary"
              />
              <IconSearch className="absolute left-3 top-2.5 text-text h-5 w-5" />
            </div>
          </div>

          <div className="flex flex-row gap-4 mt-4">
            <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full">
              <IconUserBolt className="h-5 w-5 flex-shrink-0" />
              <h1>Total Forms</h1>
              <h1>{filteredForms.length}</h1>
            </div>
            <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full">
              <IconUserBolt className="h-5 w-5 flex-shrink-0" />
              <h1>Total Submissions</h1>
              <h1>{totalSubmissions}</h1>
            </div>
          </div>

          <div className="mt-4">
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
                    <TableCell className="text-center">
                      {form.submissionCount}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/aiform/${form.formId}`} target="_blank">
                        <Button variant="outline" className="border-secondary">
                          <IconLink className="cursor-pointer h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/embed/${form.formId}`} target="_blank">
                        <Button variant="outline" className="border-secondary">
                          <FileJson className="cursor-pointer h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/edit-form/${form.formId}`}>
                        <Button variant="outline" className="border-secondary">
                          <IconEdit className="cursor-pointer h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/submissions/${form.formId}`}>
                        <Button variant="outline" className="border-secondary">
                          <ArrowRightIcon className="cursor-pointer h-4 w-4" />
                        </Button>
                      </Link>
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
    </div>
  );
};

export default SubmissionsPage;
