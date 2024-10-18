"use client";
import { db } from "@/configs";
import { jsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { SideBar } from "@/components/SideBar";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import FormUi from "../_components/FormUi";

interface EditFormProps {
  params: {
    formId: string;
  };
}

interface JsonForm {
  formTitle?: string;
  formHeading?: string;
  [key: string]: any; // For any additional dynamic fields
}

function EditForm({ params }: EditFormProps) {
  const { user } = useUser();
  const [jsonForm, setJsonForm] = useState<JsonForm | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
  const [error, setError] = useState<string | null>(null); // Added error state
  const router = useRouter();

  useEffect(() => {
    if (user) {
      GetFormData();
    }
  }, [user]);

  const GetFormData = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error state before fetching
    try {
      const result = await db
        .select()
        .from(jsonForms)
        .where(
          and(
            eq(jsonForms.id, params?.formId),
            eq(jsonForms.createdBy, user?.primaryEmailAddress?.emailAddress as string)
          )
        );
      if (result.length === 0) {
        throw new Error("Form not found");
      }
      setJsonForm(JSON.parse(result[0].jsonform)); // Assuming jsonform is a string that needs to be parsed
    } catch (error) {
      console.error("Error fetching form data:", error);
      setError("Unable to fetch form data. Please try again later.");
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  return (
    <div>
      <div className="flex flex-1 flex-col items-center justify-center w-full mt-10 p-10">
        <h2
          className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon /> Back
        </h2>

        {/* Display error message if any */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Show loading spinner or message */}
        {loading ? (
          <p>Loading form...</p> // You could replace this with a spinner component
        ) : (
          <div className="grid grid-flow-col grid-cols-3 gap-8 w-full">
            <div className="col-span-2 border rounded-md min-h-screen h-full p-4 flex items-center justify-center">
              {jsonForm ? (
                <FormUi jsonForm={jsonForm} />
              ) : (
                <p>Form data is unavailable.</p>
              )}
            </div>
            <div className="col-span-1 border rounded-md min-h-screen h-full p-4">
              controller
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditForm;