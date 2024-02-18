"use client";

import { CandidateProfileOutput, trpc } from "@/trpc/client";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useUploadThing } from "@/components/uploadthing/uploadthing";

export const UploadCv = () => {
  const [progress, setProgress] = useState<number>(0);
  const queryClient = useQueryClient();
  const { startUpload, isUploading } = useUploadThing("pdf", {
    onUploadProgress: (progress) => {
      setProgress(progress);
    },
    onClientUploadComplete: (res) => {
      const file = res?.at(0);
      if (!file) {
        return;
      }

      const key = getQueryKey(trpc.candidate.profile, undefined, "query");
      queryClient.setQueryData<CandidateProfileOutput>(key, (oldData) => {
        return {
          ...oldData,
          cvFileName: file.name,
          cvUrl: file.url,
          isCvUploaded: true,
        };
      });
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
        className="cursor-pointer"
      />
      {isUploading && <Progress value={progress} className="h-2" />}
    </>
  );
};
