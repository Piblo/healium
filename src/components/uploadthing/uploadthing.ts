import { HealiumFileRouter } from "@/app/api/uploadthing/core";
import { generateComponents } from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react/hooks";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<HealiumFileRouter>();

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<HealiumFileRouter>();
