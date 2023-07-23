import { Button, ButtonProps } from "./ui/button";
import { ChangeEvent, useRef } from "react";

type UploadButtonProps = {
  onFileSelected: (file: File[]) => void;
} & ButtonProps;

export const UploadButton = ({
  onFileSelected,
  ...buttonProps
}: UploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    onFileSelected(files);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFilesSelected}
      />
      <Button
        {...buttonProps}
        type="button"
        onClick={() => inputRef.current?.click()}
      />
    </>
  );
};
