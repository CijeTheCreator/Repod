/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Forms } from "./Forms";
import { delay, keyUnavailable } from "@/lib/presenter";
import { addNewTranscript, uploadFile } from "@/server/actions";
import { TBasicDetailsForm, TRedactionForm, TSpeakersForm } from "@/lib/types";

const FileUpload = () => {
  const [uploading, setUploading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [currentForm, setCurrentForm] = React.useState(1);
  const [fileURL, setFileURL] = useState<string | null | number>(null);
  const router = useRouter();

  //Form States
  const [redactionFormState, setRedactionFormState] =
    useState<TRedactionForm | null>(null);

  const [basicDetailsFormState, setBasicDetailsFormState] =
    useState<TBasicDetailsForm | null>(null);

  const [speakersFormState, setSpeakersFormState] =
    useState<TSpeakersForm | null>(null);

  const handleChange = async (file: File) => {
    const url = await uploadFile(file);
    if (url == "Something went wrong") {
      toast.error("Error uploading file");
      setFileURL(-1);
      return;
    }
    setFileURL(url);
  };
  const pollFileResult = (callback: () => void) => {
    const intervalId = setInterval(() => {
      if (fileURL !== null) {
        clearInterval(intervalId);
        callback();
      }
    }, 500);
  };

  const handleSubmit = async () => {
    pollFileResult(() => {
      if (!fileURL) {
        return;
      }
      if (typeof fileURL == "number") {
        toast.error(
          "Cannot submit because an error occured while uploading your file, refresh the page to start over",
        );
        return;
      }
      //Submit the file here
      if (!basicDetailsFormState || !redactionFormState || !speakersFormState)
        return toast.error("Error collecting form details");

      const toastId = toast.loading("Transcribing podcast", {
        description: basicDetailsFormState.podcastTitle,
        cancel: {
          label: "Cancel",
          onClick: () => toast.dismiss(toastId),
        },
      });
      addNewTranscript(
        {
          basic_details: basicDetailsFormState,
          redaction: redactionFormState,
          speakers: speakersFormState,
        },
        fileURL,
      );
      toast.dismiss(toastId);
      toast.success(basicDetailsFormState.podcastTitle);
      router.push("/podcasts");
    });
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: { "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".m4a"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      handleChange(file);
      setIsDialogOpen(true);
      const loadingToast = toast.loading("Uploading your file", {
        description: file.name,
        cancel: {
          label: "Cancel",
          onClick: () => toast.dismiss(loadingToast),
        },
      });
      await delay(5000);
      toast.dismiss(loadingToast);
      toast.success("the_joe_rogan_experience2.mp3 uploaded");
    },
  });

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (keyUnavailable(e)) return;
      console.log("Key down");
      if (e.key === "Enter") {
        e.preventDefault();
        setIsDialogOpen(false);
      }
      if (e.key === "u") {
        e.preventDefault();
        open();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  return (
    <div className="p-2 bg-emerald-50 dark:bg-emerald-800 rounded-xl dark:border-none border border-foreground-muted">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-emerald-50 dark:bg-emerald-800 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-100">
              Spilling Tea to GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-200">
              Drop audio files here
            </p>
          </>
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-neutral-900">
          <DialogHeader>
            <DialogTitle>Upload Podcast</DialogTitle>
            <DialogDescription>
              Your podcast is uploading I just need a few final details!
            </DialogDescription>
          </DialogHeader>
          <Forms
            currentForm={currentForm}
            setCurrentForm={setCurrentForm}
            setSpeakersFormStateAction={setSpeakersFormState}
            setBasicDetailsFormStateAction={setBasicDetailsFormState}
            setRedactionFormStateAction={setRedactionFormState}
            submitForm={() => handleSubmit()}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUpload;
