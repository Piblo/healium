import { ContractType } from "@/app/job-offer/create/page";

const contractTypeMap: Record<ContractType, string> = {
  "fixed-term": "Temporal",
  "full-time": "Indefinido",
  "part-time": "Tiempo parcial",
};

export function getContractTypeLabel(contractType: ContractType) {
  return contractTypeMap[contractType];
}
