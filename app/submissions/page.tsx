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
import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import moment from "moment"; // Import moment.js
import { Button } from "@/components/ui/button";
import { ArrowBigRightIcon, ArrowRightIcon, FileJson } from "lucide-react";

const SubmissionsPage = () => {
  const [formsData, setFormsData] = useState<any[]>([]);
  const [filteredForms, setFilteredForms] = useState<any[]>([]); // State to store filtered forms
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    filterFormsByTitle(searchQuery);
  }, [searchQuery, formsData]); // Filter forms whenever the search query or formsData changes

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
        .groupBy(jsonForms.id, jsonForms.jsonform, jsonForms.createdAt)
        .orderBy(sql`COUNT(${submissions.id}) DESC`);

      const processedData = result.map((form) => {
        const parsedForm = JSON.parse(form.jsonform);

        // Log the `createdAt` value to inspect the format
        console.log("Raw createdAt value:", form.createdAt);

        // Ensure `createdAt` is in a valid format before parsing
        let createdAt;
        if (form.createdAt) {
          // Try parsing with moment, assuming it could be an ISO string
          createdAt = moment(form.createdAt).isValid()
            ? moment(form.createdAt).format("DD/MM/YYYY")
            : "Invalid Date Format";
        } else {
          createdAt = "N/A";
        }

        return {
          formId: form.formId,
          formTitle: parsedForm.formTitle || "Untitled Form",
          createdAt: createdAt, // Display formatted date or "N/A" if the date is invalid
          submissionCount: Number(form.submissionCount),
        };
      });

      const total = processedData.reduce(
        (sum, form) => sum + form.submissionCount,
        0
      );

      setFormsData(processedData);
      setFilteredForms(processedData); // Initially set filteredForms to all forms
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
    return <div>Loading forms...</div>;
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

          {/* Search Bar */}
          <div className="flex flex-row gap-4 mt-4 ">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by form title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                className="border border-accent rounded-md p-2 pl-10 w-full bg-primary"
              />
              <IconSearch className="absolute left-3 top-2.5 text-text h-5 w-5" />
            </div>
          </div>

          <div className="flex flex-row gap-4 mt-4">
            <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full">
              <IconUserBolt className="h-5 w-5 flex-shrink-0" />
              <h1>Total Forms</h1>
              <h1>{filteredForms.length}</h1> {/* Show total filtered forms */}
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
                  <TableHead>Form Title</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Submission Count</TableHead>
                  <TableHead>Live Link</TableHead>
                  <TableHead>Embed Link</TableHead>
                  <TableHead>Edit</TableHead>
                  <TableHead>View Submissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.map((form) => (
                  <TableRow key={form.formId}>
                    <TableCell>{form.formTitle}</TableCell>
                    <TableCell>{form.createdAt}</TableCell>{" "}
                    {/* Display formatted date */}
                    <TableCell className="text-center">
                      {form.submissionCount}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Link
                          className="flex"
                          href={`/aiform/${form.formId}`}
                          target="_blank"
                        >
                          <Button>
                            {/* <IconLink className="cursor-pointer" /> */}
                            <IconLink className="cursor-pointer" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/embed/${form.formId}`} target="_blank">
                        <Button>
                          <FileJson className="cursor-pointer" />
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/edit-form/${form.formId}`}>
                        <Button>
                          <IconEdit className="cursor-pointer" />
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/submissions/${form.formId}`}>
                        <Button>
                          <ArrowRightIcon className="cursor-pointer" />
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
                  <TableCell colSpan={3}></TableCell>
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
