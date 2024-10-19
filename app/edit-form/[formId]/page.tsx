"use client";
import { db } from "@/configs";
import { jsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
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
  formFields?: { [key: string]: any }[]; // Define the form fields as an array of objects
}

function EditForm({ params }: EditFormProps) {
  const { user } = useUser();
  const [jsonForm, setJsonForm] = useState<JsonForm | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      GetFormData();
    }
  }, [user]);

  const GetFormData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await db
        .select()
        .from(jsonForms)
        .where(
          and(
            eq(jsonForms.id, params?.formId),
            eq(
              jsonForms.createdBy,
              user?.primaryEmailAddress?.emailAddress as string
            )
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
      setLoading(false);
    }
  };

  const updateFormInDb = async (updatedForm: JsonForm) => {
    try {
      await db
        .update(jsonForms)
        .set({ jsonform: JSON.stringify(updatedForm) })
        .where(eq(jsonForms.id, params?.formId));
    } catch (error) {
      console.error("Error updating form data:", error);
    }
  };

  const onFieldUpdate = (updatedField: any, index: number) => {
    if (jsonForm) {
      const updatedFields = [...jsonForm.formFields];
      updatedFields[index] = { ...updatedFields[index], ...updatedField };
      const updatedForm = { ...jsonForm, formFields: updatedFields };
      setJsonForm(updatedForm);
      updateFormInDb(updatedForm); // Update form in the DB
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

        {error && <p className="text-red-500">{error}</p>}

        {loading ? (
          <p>Loading form...</p>
        ) : (
          <div className="grid grid-flow-col grid-cols-3 gap-8 w-full">
            <div className="col-span-2 border rounded-md min-h-screen h-full p-4 flex items-center justify-center">
              {jsonForm ? (
                <FormUi jsonForm={jsonForm} onFieldUpdate={onFieldUpdate} />
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