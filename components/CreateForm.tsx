"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { AiChatSession } from "@/configs/AiModel";
import { useUser } from "@clerk/nextjs";
import { db } from "@/configs";
import { jsonForms } from "@/configs/schema";
import moment from "moment";
import { useRouter } from "next/navigation";

const CreateForm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState<string>("Create a waitlist form");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const route = useRouter();

  useEffect(() => {
    console.log("CreateForm component mounted");
    return () => console.log("CreateForm component unmounted");
  }, []);

  let userInfo;
  try {
    userInfo = useUser();
    console.log("User info:", userInfo);
  } catch (error) {
    console.error("Error in useUser hook:", error);
    setError("Error fetching user information");
  }

  const { isLoaded, isSignedIn, user } = userInfo || {};

  const PROMPT = `
  On the basis of the following description, please provide a form in JSON format. The JSON object should include:
  
  - formTitle: A title for the form.
  - formSubheading: A subheading for the form.
  - formFields: An array of form field objects, each containing the following properties:
    - fieldName: The unique name/identifier of the form field.
    - placeholder: Placeholder text for the form field (if applicable).
    - formLabel: The label displayed next to the form field.
    - fieldType: The type of the field (e.g., text, email, select, checkbox, radio, etc.).
    - required: A boolean indicating whether the field is required.
  
  If the fieldType is "select", please include an additional property called "selectOptions", which is an array of objects with the following fields:
    - label: The label shown for each option.
    - value: The value associated with each option.
  
  If the fieldType is "radio", please include an additional property called "radioOptions", which is an array of objects with the following fields:
    - label: The label shown for each radio button.
    - value: The value associated with each option.
  
  If the fieldType is "checkbox", please include an additional property called "checkboxOptions", which is an array of objects with the following fields:
    - label: The label shown for each checkbox.
    - value: The value associated with each option.
  
  The output should be structured in valid JSON format.
  
  Example JSON Format:
  
  {
    "formTitle": "User Preferences",
    "formSubheading": "Please fill in your preferences below.",
    "formFields": [
      {
        "fieldName": "username",
        "placeholder": "Enter your username",
        "formLabel": "Username",
        "fieldType": "text",
        "required": true
      },
      {
        "fieldName": "email",
        "placeholder": "Enter your email",
        "formLabel": "Email",
        "fieldType": "email",
        "required": true
      },
      {
        "fieldName": "theme",
        "placeholder": "Select theme",
        "formLabel": "Theme",
        "fieldType": "select",
        "required": false,
        "selectOptions": [
          { "label": "Light", "value": "light" },
          { "label": "Dark", "value": "dark" },
          { "label": "System", "value": "system" }
        ]
      },
      {
        "fieldName": "notifications",
        "formLabel": "Enable Notifications",
        "fieldType": "checkbox",
        "required": false,
        "checkboxOptions": [
          { "label": "Email", "value": "email" },
          { "label": "SMS", "value": "sms" },
          { "label": "Push", "value": "push" }
        ]
      },
      {
        "fieldName": "gender",
        "formLabel": "Gender",
        "fieldType": "radio",
        "required": false,
        "radioOptions": [
          { "label": "Male", "value": "male" },
          { "label": "Female", "value": "female" },
          { "label": "Other", "value": "other" }
        ]
      }
    ]
  }
  `;

  const onCreateForm = async () => {
    if (!isLoaded || !isSignedIn) {
      console.error("User is not signed in");
      setError("User is not signed in");
      return;
    }

    console.log("User input:", userInput);
    setLoading(true);
    setOpenDialog(false);

    try {
      const result = await AiChatSession("Description" + userInput + PROMPT);
      const aiResponse = await result.response.text();

      if (aiResponse) {
        const resp = await db
          .insert(jsonForms)
          .values({
            jsonform: aiResponse,
            createdBy:
              user?.primaryEmailAddress?.emailAddress || "Unknown User",
            createdAt: moment().format("DD/MM/YYYY"),
          })
          .returning({ id: jsonForms.id });

        console.log("New Form ID:", resp[0].id);
        if (resp[0].id) {
          route.push("/edit-form/" + resp[0].id);
        }
      }
    } catch (error) {
      console.error("Error during AI session:", error);
      setError("Error creating form");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to create forms.</div>;
  }

  return (
    <div>
      <Button onClick={() => setOpenDialog(true)} disabled={loading}>
        {loading ? "Generating..." : "Generate Form"}
      </Button>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              <Textarea
                className="m-2"
                placeholder="Enter form details"
                value={userInput}
                onChange={(event) => setUserInput(event.target.value)}
              />
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => setOpenDialog(false)}
                  variant="destructive"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={onCreateForm}
                  variant="default"
                  disabled={loading || !userInput.trim()}
                >
                  {loading ? "Creating..." : "Create"}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateForm;
