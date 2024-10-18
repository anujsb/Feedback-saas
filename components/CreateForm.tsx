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
      const result = await AiChatSession(userInput);
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
