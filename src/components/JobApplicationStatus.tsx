import { JobApplication } from "@/server/database/schema";
import { Status } from "./Status";

type JobApplicationStatusProps = {
  status: JobApplication["status"];
};

export const JobApplicationStatus = ({ status }: JobApplicationStatusProps) => {
  if (status === "approved") {
    return <Status color="green">Aprobado</Status>;
  }

  if (status === "pending") {
    return <Status color="orange">Pendiente</Status>;
  }

  return <Status color="red">Rechazado</Status>;
};
