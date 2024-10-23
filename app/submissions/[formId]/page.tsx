"use client";

import React, { useEffect, useState } from "react";
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

interface FormSubmissionsProps {
  params: {
    formId?: string;
  };
}

const FormSubmissionsPage: React.FC<FormSubmissionsProps> = ({ params }) => {
  const [submissionData, setSubmissionData] = useState<any[]>([]);
  const [formTitle, setFormTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.formId) {
      fetchFormSubmissions();
    }
  }, [params]);

  const fetchFormSubmissions = async () => {
    try {
      // First, fetch the form details to get the title
      const formResult = await db
        .select()
        .from(jsonForms)
        .where(eq(jsonForms.id, Number(params.formId)));

      if (formResult && formResult.length > 0) {
        const parsedForm = JSON.parse(formResult[0].jsonform);
        setFormTitle(parsedForm.formTitle || "Untitled Form");
      }

      // Then fetch all submissions for this form
      const result = await db
        .select()
        .from(submissions)
        .where(eq(submissions.formId, Number(params.formId)));

      const processedData = result.map((item) => ({
        ...item,
        submissionData: JSON.parse(item.submissionData),
      }));

      setSubmissionData(processedData);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Image src="/Loadertrans.gif" alt="my gif" height={150} width={150} />
        Loading submissions...
      </div>
    );
  }

  // Get all unique field names from submissions
  const allFields = new Set<string>();
  submissionData.forEach((submission) => {
    Object.keys(submission.submissionData).forEach((field) => {
      allFields.add(field);
    });
  });
  const fieldNames = Array.from(allFields);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row flex-1 w-full overflow-hidden",
        "h-screen"
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
                      {new Date(submission.createdAt).toLocaleDateString()}
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
