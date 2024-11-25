/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { Audio } from "react-loader-spinner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileUploadForm } from "./FileUploadForm";
import { SpeakersForm } from "./FileUploadFormSpeakersInOrder";
import { RedactionForm } from "./RedactionForm";
import { Forms } from "./Forms";
import { delay, keyUnavailable } from "@/lib/presenter";

const FileUpload = () => {
  // const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [currentForm, setCurrentForm] = React.useState(1);
  const [file, setFile] = useState<File | null>(null);
  const handleChange = (file: File) => {
    setFile(file); // Update the file state
  };
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: { "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".m4a"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      handleChange(file);
      setIsDialogOpen(true);
      const loadingToast = toast.loading("Uploading your file", {
        description: "the_joe_rogan_experience.mp3",
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
        //TODO: Other form submission stuff
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
          <Forms currentForm={currentForm} setCurrentForm={setCurrentForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUpload;
