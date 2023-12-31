import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatusProps = {
  color: "green" | "orange" | "red";
  children: ReactNode;
  className?: string;
};

export const Status = ({ color, children, className }: StatusProps) => {
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <div className={cn("rounded-full h-2 w-2", getStatusColor(color))} />
      {children}
    </div>
  );
};

function getStatusColor(color: StatusProps["color"]) {
  const map: Record<StatusProps["color"], string> = {
    green: "bg-teal-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  return map[color];
}
