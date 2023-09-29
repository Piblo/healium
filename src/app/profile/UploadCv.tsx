"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useUploadThing } from "@/components/uploadthing/uploadthing";

export const UploadCv = () => {
  const [progress, setProgress] = useState<number>(0);
  const { startUpload, isUploading } = useUploadThing("pdf", {
    onUploadProgress: (progress) => {
      setProgress(progress);
    },
  });

  function handleFileSelected(files: FileList | null) {
    if (!files) {
      return;
    }

    const filesArray = Array.from(files);
    startUpload(filesArray);
  }

  return (
    <>
      <Input
        id="cv"
        type="file"
        accept="application/pdf"
        onChange={(e) => handleFileSelected(e.currentTarget.files)}
        disabled={isUploading}
      />
      {isUploading && <Progress value={progress} className="h-2" />}
    </>
  );
};
