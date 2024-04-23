import NextLink, { LinkProps } from "next/link";

import React from "react";
import { cn } from "@/lib/utils";

export const Link = ({
  children,
  className,
  ...props
}: LinkProps & { children: React.ReactNode; className?: string }) => {
  return (
    <NextLink
      className={cn(
        "text-primary hover:underline underline-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
};
