export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  label: string;
  dueDate: Date | string;
  priority: Priority;
  state: string;
  createdAt: Date | string;
}
