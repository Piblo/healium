import { HTMLProps } from "react";
import { cn } from "@/lib/utils";

export const Link = ({
  children,
  className,
  ...props
}: HTMLProps<HTMLAnchorElement>) => {
  return (
    <a className={cn("text-primary hover:underline", className)} {...props}>
      {children}
    </a>
  );
};
