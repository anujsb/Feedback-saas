"use client";

import { jsonForms, submissions } from "@/configs/schema";
import React, { useEffect, useState } from "react";
import { db } from "@/configs";
import { eq } from "drizzle-orm";
import ReadOnlyFormUi from "@/app/edit-form/_components/ReadOnlyFormUi";
import { useRouter } from 'next/navigation';

interface LiveAiFormProps {
  params: {
    formId?: string;
  };
}

const LiveAiForm: React.FC<LiveAiFormProps> = ({ params }) => {
  const [jsonForm, setJsonForm] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    if (params?.formId) {
      GetFormData();
    } else {
      console.error("Form ID is missing or undefined.");
      setLoading(false);
    }
  }, [params]);

  const GetFormData = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(jsonForms)
        .where(eq(jsonForms.id, Number(params.formId)));

      if (result && result.length > 0) {
        const parsedForm = JSON.parse(result[0].jsonform);
        setJsonForm(parsedForm);
      } else {
        console.error("No form data found for the provided form ID.");
      }
    } catch (error) {
      console.error("Error fetching form data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.insert(submissions).values({
        formId: Number(params.formId),
        submissionData: JSON.stringify(formData),
      });
      alert('Form submitted successfully!');
      router.push('/submissions');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading form data...</div>;
  }

  if (!params?.formId) {
    return <div>Error: No form ID provided.</div>;
  }

  if (!jsonForm) {
    return <div>No form data found for ID: {params.formId}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <ReadOnlyFormUi 
        jsonForm={jsonForm} 
        onInputChange={handleInputChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default LiveAiForm;