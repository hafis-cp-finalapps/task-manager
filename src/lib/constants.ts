import type { Priority } from "./types";

export const DEFAULT_STATES = ["To-do", "In Progress", "Done", "Canceled"];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
