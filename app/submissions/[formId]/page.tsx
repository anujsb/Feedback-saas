"use client";

import React from "react";
import { useEffect, useState, useMemo } from "react";
import { SideBar } from "@/components/SideBar";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/configs";
import { submissions, jsonForms } from "@/configs/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

interface FormSubmission {
  id: number;
  // createdAt: Date | string; // Updated to accept both Date and string
  createdAt: Date;
  submissionData: Record<string, string>;
}

interface FormSubmissionsProps {
  params: {
    formId?: string;
  };
}

const LoadingSpinner = () => (
  <div className="w-full h-screen flex flex-col items-center justify-center">
    <Image
      src="/Loadertrans.gif"
      alt="Loading..."
      height={150}
      width={150}
      unoptimized
    />
    <span>Loading submissions...</span>
  </div>
);

const FormSubmissionsPage: React.FC<FormSubmissionsProps> = ({ params }) => {
  const [submissionData, setSubmissionData] = useState<FormSubmission[]>([]);
  const [formTitle, setFormTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string | Date): string => {
    try {
      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      // Format the date using Intl.DateTimeFormat
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  useEffect(() => {
    const fetchFormSubmissions = async () => {
      if (!params?.formId) return;

      try {
        const [formResult, submissionsResult] = await Promise.all([
          db
            .select()
            .from(jsonForms)
            .where(eq(jsonForms.id, Number(params.formId))),
          db
            .select()
            .from(submissions)
            .where(eq(submissions.formId, Number(params.formId))),
        ]);

        if (formResult?.[0]) {
          const parsedForm = JSON.parse(formResult[0].jsonform);
          setFormTitle(parsedForm.formTitle || "Untitled Form");
        }

        const processedData: FormSubmission[] = submissionsResult.map(
          (item) => ({
            id: item.id,
            // createdAt: new Date(item.createdAt),
            createdAt: new Date(item.createdAt),
            submissionData: JSON.parse(item.submissionData),
          })
        );

        setSubmissionData(processedData);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormSubmissions();
  }, [params?.formId]);

  const fieldNames = useMemo(() => {
    const allFields = new Set<string>();
    submissionData.forEach((submission) => {
      Object.keys(submission.submissionData).forEach((field) => {
        allFields.add(field);
      });
    });
    return Array.from(allFields);
  }, [submissionData]);

  if (loading) return <LoadingSpinner />;

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row flex-1 w-full overflow-hidden h-screen"
      )}
    >
      <SideBar />
      <div className="flex flex-1 flex-col items-center m-20 w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{formTitle} - Submissions</h1>
            <div className="text-sm text-gray-500">
              Total Submissions: {submissionData.length}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Date</TableHead>
                  {fieldNames.map((field) => (
                    <TableHead key={field}>{field}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionData.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.id}</TableCell>
                    <TableCell>
                      {/* {submission.createdAt instanceof Date
                        ? submission.createdAt.toLocaleDateString()
                        : new Date(submission.createdAt).toLocaleDateString()} */}
                      {formatDate(submission.createdAt)}
                    </TableCell>
                    {fieldNames.map((field) => (
                      <TableCell key={field}>
                        {submission.submissionData[field] || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSubmissionsPage;
