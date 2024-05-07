import dayjs from "dayjs";

export function formatDate(date: Date | string) {
  return dayjs(date).format("DD/MM/YYYY");
}

export function formatDateRange(from: Date | string, to: Date | string) {
  return `${dayjs(from).format("DD/MM/YYYY")} - ${dayjs(to).format(
    "DD/MM/YYYY"
  )}`;
}
