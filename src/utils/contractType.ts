export type ContractType = "full-time" | "part-time" | "fixed-term";

const contractTypeMap: Record<ContractType, string> = {
  "fixed-term": "Temporal",
  "full-time": "Indefinido",
  "part-time": "Tiempo parcial",
};

export function getContractTypeLabel(contractType: ContractType) {
  return contractTypeMap[contractType];
}
