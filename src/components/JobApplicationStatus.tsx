import { JobApplication } from "@/server/database/schema";
import { cn } from "@/lib/utils";

type JobApplicationStatusProps = {
  status: JobApplication["status"];
};

export const JobApplicationStatus = ({ status }: JobApplicationStatusProps) => {
  return (
    <li className="flex items-center gap-2 text-sm">
      <div className={cn("rounded-full h-2 w-2", getStatusColor(status))} />
      {getApplicationStatusLabel(status)}
    </li>
  );
};

function getApplicationStatusLabel(status: JobApplication["status"]) {
  const map: Record<JobApplication["status"], string> = {
    approved: "Aprobado",
    pending: "Pendiente",
    rejected: "Rechazado",
  };

  return map[status];
}

function getStatusColor(status: JobApplication["status"]) {
  const map: Record<JobApplication["status"], string> = {
    approved: "bg-teal-500",
    pending: "bg-orange-500",
    rejected: "bg-red-500",
  };
  return map[status];
}
